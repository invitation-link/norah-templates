import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-auth";

const allowed = new Map([["image/jpeg","jpg"],["image/png","png"],["image/webp","webp"],["audio/mpeg","mp3"],["audio/mp4","m4a"]]);

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const { data: invitation } = await (auth.supabase.from("invitations") as any).select("id,plan_id").eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  if (invitation.plan_id === "FREE_AD_SUPPORTED") return NextResponse.json({ error: "Media uploads require Essential or Premium" }, { status: 402 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file" }, { status: 400 });
  const extension = allowed.get(file.type);
  if (!extension || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Use JPG, PNG, WebP, MP3 or M4A under 5 MB" }, { status: 400 });
  const path = `${auth.user.id}/${id}/${randomUUID()}.${extension}`;
  const { error } = await auth.supabase.storage.from("invitations").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: "Could not upload this file" }, { status: 500 });
  const { data: signed } = await auth.supabase.storage.from("invitations").createSignedUrl(path, 3600);
  return NextResponse.json({ asset: `supabase://invitations/${path}`, previewUrl: signed?.signedUrl || "" }, { status: 201 });
}
