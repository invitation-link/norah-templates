import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { PRICING } from "@/lib/product";
import { requireUser } from "@/lib/server-auth";

const schema = z.object({ invitationId: z.string().uuid(), planId: z.enum(["ESSENTIAL", "PREMIUM"]) });

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid paid plan" }, { status: 400 });
  const { invitationId, planId } = parsed.data;
  const { data: invitation } = await (auth.supabase.from("invitations") as any)
    .select("id").eq("id", invitationId).eq("user_id", auth.user.id).single();
  if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ error: "Payments are not enabled yet" }, { status: 503 });
  const amountPaise = PRICING[planId].amount * 100;
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `invite_${invitationId.slice(0, 8)}_${Date.now()}`,
    notes: { invitation_id: invitationId, user_id: auth.user.id, plan_id: planId },
  });
  const { error } = await (auth.supabase.from("payments") as any).insert({
    user_id: auth.user.id,
    invitation_id: invitationId,
    plan_id: planId,
    amount_paise: amountPaise,
    currency: "INR",
    provider_order_id: order.id,
    status: "CREATED",
  });
  if (error) return NextResponse.json({ error: "Could not prepare checkout" }, { status: 500 });
  await (auth.supabase.from("invitations") as any).update({ plan_id: planId, status: "PAYMENT_PENDING", updated_at: new Date().toISOString() }).eq("id", invitationId).eq("user_id", auth.user.id);
  return NextResponse.json({ orderId: order.id, amount: amountPaise, currency: "INR", key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId });
}
