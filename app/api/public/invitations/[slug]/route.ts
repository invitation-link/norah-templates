import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { publicInvitation } from "@/lib/product";
import { resolveInvitationAssets } from "@/lib/assets";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data, error } = await (supabase.from("invitations") as any)
    .select("id,slug,template_id,plan_id,status,content,published_at")
    .eq("slug", slug).eq("status", "PUBLISHED").single();
  if (error || !data) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  await (supabase.from("invitation_events") as any).insert({ invitation_id: data.id, event_type: "view", metadata: {} });
  data.content = await resolveInvitationAssets(supabase, data.content);
  return NextResponse.json({ invitation: publicInvitation(data) }, { headers: { "Cache-Control": "private, no-store" } });
}
