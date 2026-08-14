import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createParticipant } from "@/app/lib/tiranga-store";

const participationSchema = z.object({
  name: z.string().trim().min(1).max(28),
  dedication: z.string().trim().max(48).optional(),
  referredBy: z.string().trim().max(100).optional(),
  community: z.string().trim().max(80).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = participationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please provide a valid first name." }, { status: 400 });
  const { participant, stats, persistent } = await createParticipant(parsed.data);
  return NextResponse.json({
    participantId: participant.id,
    participantNumber: persistent ? stats.nationalCount : null,
    persistent,
  }, { status: 201 });
}
