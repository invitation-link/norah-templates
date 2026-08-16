import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const { data: owned } = await (auth.supabase.from("invitations") as any).select("id").eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  if (!owned) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  const { data, error } = await (auth.supabase.from("rsvps") as any).select("*").eq("invitation_id", id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load replies" }, { status: 500 });
  return NextResponse.json({ rsvps: data || [] });
}
