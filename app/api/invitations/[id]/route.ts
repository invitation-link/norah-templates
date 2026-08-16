import { NextRequest, NextResponse } from "next/server";
import { contentForPlan, FREE_TEMPLATE_IDS, invitationContentSchema, planIds } from "@/lib/product";
import { requireUser } from "@/lib/server-auth";
import { z } from "zod";
import { resolveInvitationAssets } from "@/lib/assets";

const updateSchema = z.object({
  templateId: z.string().regex(/^[a-z0-9-]{2,80}$/).optional(),
  slug: z.string().regex(/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])?$/).optional(),
  planId: z.enum(planIds).optional(),
  content: invitationContentSchema.optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const { data, error } = await (auth.supabase.from("invitations") as any).select("*").eq("id", id).eq("user_id", auth.user.id).single();
  if (error || !data) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  return NextResponse.json({ invitation: { ...data, asset_content: data.content, content: await resolveInvitationAssets(auth.supabase, data.content) } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the invitation details", issues: parsed.error.flatten() }, { status: 400 });
  const { id } = await params;
  const { data: current } = await (auth.supabase.from("invitations") as any).select("template_id,plan_id,content").eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  if (!current) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  const nextTemplate = parsed.data.templateId || current.template_id;
  const nextPlan = parsed.data.planId || current.plan_id;
  if (nextPlan === "FREE_AD_SUPPORTED" && !(FREE_TEMPLATE_IDS as readonly string[]).includes(nextTemplate)) return NextResponse.json({ error: "This design requires Essential or Premium" }, { status: 402 });
  const changes: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.templateId) changes.template_id = parsed.data.templateId;
  if (parsed.data.slug && nextPlan !== "FREE_AD_SUPPORTED") changes.slug = parsed.data.slug;
  if (parsed.data.planId) changes.plan_id = parsed.data.planId;
  if (parsed.data.content) changes.content = contentForPlan(parsed.data.content, nextPlan, nextTemplate);
  const { data, error } = await (auth.supabase.from("invitations") as any)
    .update(changes).eq("id", id).eq("user_id", auth.user.id)
    .select("id,template_id,slug,plan_id,status,content,published_at,created_at,updated_at").single();
  if (error?.code === "23505") return NextResponse.json({ error: "That link is already taken" }, { status: 409 });
  if (error || !data) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  return NextResponse.json({ invitation: data });
}
