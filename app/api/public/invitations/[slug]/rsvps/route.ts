import { NextRequest, NextResponse } from "next/server";
import { rsvpInputSchema } from "@/lib/product";
import { rateLimit } from "@/lib/server-auth";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await rateLimit(request, "rsvp", 8, 3600))) return NextResponse.json({ error: "Please wait before sending another reply" }, { status: 429 });
  const parsed = rsvpInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check your RSVP details" }, { status: 400 });
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: invitation } = await (supabase.from("invitations") as any).select("id").eq("slug", slug).eq("status", "PUBLISHED").single();
  if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  const input = parsed.data;
  const { error } = await (supabase.from("rsvps") as any).insert({ invitation_id: invitation.id, guest_name: input.guestName, guest_phone: input.guestPhone || null, guest_email: input.guestEmail || null, attending: input.attending, guests_count: input.guestsCount, message: input.message || null });
  if (error) return NextResponse.json({ error: "Could not send your reply" }, { status: 500 });
  await (supabase.from("invitation_events") as any).insert({ invitation_id: invitation.id, event_type: "rsvp", metadata: { attending: input.attending } });
  return NextResponse.json({ success: true }, { status: 201 });
}
