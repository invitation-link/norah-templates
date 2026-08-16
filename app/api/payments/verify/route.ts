import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { requireUser } from "@/lib/server-auth";

const schema = z.object({ orderId: z.string().min(4), paymentId: z.string().min(4), signature: z.string().min(16) });

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Missing payment verification details" }, { status: 400 });
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) return NextResponse.json({ error: "Payments are not enabled yet" }, { status: 503 });
  const { orderId, paymentId, signature } = parsed.data;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const valid = expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  const { data: payment } = await (auth.supabase.from("payments") as any)
    .select("id,invitation_id,plan_id,amount_paise,currency,status,provider_payment_id").eq("provider_order_id", orderId).eq("user_id", auth.user.id).single();
  if (!payment) return NextResponse.json({ error: "Payment order not found" }, { status: 404 });
  if (payment.status === "PAID") {
    if (payment.provider_payment_id && payment.provider_payment_id !== paymentId) return NextResponse.json({ error: "Payment does not match this order" }, { status: 409 });
    return NextResponse.json({ success: true, paid: true, invitationId: payment.invitation_id, planId: payment.plan_id });
  }
  const providerPayment = await new Razorpay({ key_id: keyId, key_secret: secret }).payments.fetch(paymentId);
  const providerMatches = providerPayment.order_id === orderId
    && Number(providerPayment.amount) === payment.amount_paise
    && providerPayment.currency === payment.currency;
  if (!providerMatches) return NextResponse.json({ error: "Payment details do not match this order" }, { status: 409 });
  if (providerPayment.status === "captured") {
    await (auth.supabase.from("payments") as any).update({ provider_payment_id: paymentId, status: "PAID", paid_at: new Date().toISOString() }).eq("id", payment.id).eq("user_id", auth.user.id);
    return NextResponse.json({ success: true, paid: true, invitationId: payment.invitation_id, planId: payment.plan_id });
  }
  return NextResponse.json({ success: true, paid: false, message: "Payment is being confirmed" }, { status: 202 });
}
