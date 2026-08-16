import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/server-auth";
import { z } from "zod";

const schema = z.object({ eventType: z.enum(["open", "share", "sponsor_view", "sponsor_click", "rsvp_open"]), metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional() });

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await rateLimit(request, "invite-event", 120, 3600))) return NextResponse.json({ error: "Too many events" }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: invitation } = await (supabase.from("invitations") as any).select("id").eq("slug", slug).eq("status", "PUBLISHED").single();
  if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  await (supabase.from("invitation_events") as any).insert({ invitation_id: invitation.id, event_type: parsed.data.eventType, metadata: parsed.data.metadata || {} });
  return new NextResponse(null, { status: 204 });
}
