import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { contentForPlan, FREE_TEMPLATE_IDS, invitationInputSchema } from "@/lib/product";
import { rateLimit, requireUser } from "@/lib/server-auth";
import { resolveInvitationAssets } from "@/lib/assets";

function generatedSlug(title: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "invitation";
  return `${base}-${randomBytes(3).toString("hex")}`;
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  const { data, error } = await (auth.supabase.from("invitations") as any)
    .select("id,template_id,slug,plan_id,status,content,published_at,created_at,updated_at,rsvps(count),invitation_events(count)")
    .eq("user_id", auth.user.id).order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load invitations" }, { status: 500 });
  const rows = await Promise.all((data || []).map(async (row: any) => ({ ...row, content: await resolveInvitationAssets(auth.supabase, row.content), invitation_events: row.plan_id === "PREMIUM" ? row.invitation_events : [] })));
  return NextResponse.json({ invitations: rows });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;
  if (!(await rateLimit(request, "invitation-create", 20, 3600))) return NextResponse.json({ error: "Please wait before creating another invitation" }, { status: 429 });
  const parsed = invitationInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the invitation details", issues: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;
  if (input.planId === "FREE_AD_SUPPORTED" && !(FREE_TEMPLATE_IDS as readonly string[]).includes(input.templateId)) return NextResponse.json({ error: "This design requires Essential or Premium" }, { status: 402 });
  const slug = input.planId === "FREE_AD_SUPPORTED" ? generatedSlug(input.content.eventTitle) : input.slug || generatedSlug(input.content.eventTitle);
  const { data, error } = await (auth.supabase.from("invitations") as any)
    .insert({ user_id: auth.user.id, template_id: input.templateId, slug, plan_id: input.planId, status: "DRAFT", content: contentForPlan(input.content, input.planId, input.templateId), updated_at: new Date().toISOString() })
    .select("id,template_id,slug,plan_id,status,content,published_at,created_at,updated_at").single();
  if (error?.code === "23505") return NextResponse.json({ error: "That link is already taken" }, { status: 409 });
  if (error) return NextResponse.json({ error: "Could not save the invitation" }, { status: 500 });
  return NextResponse.json({ invitation: data }, { status: 201 });
}
