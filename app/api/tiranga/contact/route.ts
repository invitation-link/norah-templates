import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveTirangaContact } from "@/app/lib/tiranga-store";

const contactSchema = z.object({
  participantId: z.string().uuid().optional(),
  shareId: z.string().trim().min(1).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  deliveryConsent: z.literal(true),
  marketingConsent: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please provide a valid mobile number and delivery consent." }, { status: 400 });
  const result = await saveTirangaContact({
    participantId: parsed.data.participantId,
    shareId: parsed.data.shareId,
    phone: parsed.data.phone,
    marketingConsent: parsed.data.marketingConsent,
  });
  return NextResponse.json(result, { status: 201 });
}
