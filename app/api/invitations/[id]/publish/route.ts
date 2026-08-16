import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const { data: invitation } = await (auth.supabase.from("invitations") as any)
    .select("id,slug,plan_id,status").eq("id", id).eq("user_id", auth.user.id).single();
  if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  if (invitation.plan_id !== "FREE_AD_SUPPORTED") {
    const { data: payment } = await (auth.supabase.from("payments") as any)
      .select("id").eq("invitation_id", id).eq("user_id", auth.user.id)
      .eq("plan_id", invitation.plan_id).eq("status", "PAID").maybeSingle();
    if (!payment) return NextResponse.json({ error: "Complete payment before publishing" }, { status: 402 });
  }
  const publishedAt = new Date().toISOString();
  const { data, error } = await (auth.supabase.from("invitations") as any)
    .update({ status: "PUBLISHED", published_at: publishedAt, updated_at: publishedAt })
    .eq("id", id).eq("user_id", auth.user.id).select("id,slug,plan_id,status,published_at").single();
  if (error) return NextResponse.json({ error: "Could not publish the invitation" }, { status: 500 });
  return NextResponse.json({ invitation: data });
}
