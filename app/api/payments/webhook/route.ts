import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const valid = expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const payload = JSON.parse(body);
  const paymentEntity = payload?.payload?.payment?.entity;
  const orderEntity = payload?.payload?.order?.entity;
  const orderId = paymentEntity?.order_id || orderEntity?.id;
  const paymentId = paymentEntity?.id || orderEntity?.payment_id;
  if (!orderId || !["payment.captured", "order.paid", "payment.failed"].includes(payload?.event)) return NextResponse.json({ received: true });

  const supabase = createServerClient();
  const { data: payment } = await (supabase.from("payments") as any).select("id,invitation_id,amount_paise,currency,status").eq("provider_order_id", orderId).maybeSingle();
  const providerAmount = Number(paymentEntity?.amount || orderEntity?.amount_paid || 0);
  const providerCurrency = paymentEntity?.currency || orderEntity?.currency;
  const matches = payment && providerAmount === payment.amount_paise && providerCurrency === payment.currency;
  if (matches && payload.event === "payment.failed" && payment.status !== "PAID") {
    await (supabase.from("payments") as any).update({ provider_payment_id: paymentId || null, status: "FAILED" }).eq("id", payment.id);
  } else if (matches && payment.status !== "PAID") {
    await (supabase.from("payments") as any).update({ provider_payment_id: paymentId || null, status: "PAID", paid_at: new Date().toISOString() }).eq("id", payment.id);
  }
  return NextResponse.json({ received: true });
}
