import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import type { InviteData } from "@/app/components/templates/types";
import PublishedInvitationClient from "./PublishedInvitationClient";
import { resolveInvitationAssets } from "@/lib/assets";

type Props = { params: Promise<{ templateId: string; slug: string }> };

async function getInvitation(slug: string) {
  const supabase = createServerClient();
  const { data } = await (supabase.from("invitations") as any)
    .select("id,slug,template_id,plan_id,status,content,published_at")
    .eq("slug", slug).eq("status", "PUBLISHED").maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  if (!invitation) return { title: "Invitation not found", robots: { index: false, follow: false } };
  const content = await resolveInvitationAssets(createServerClient(), invitation.content);
  return {
    title: content.eventTitle || "You're invited",
    description: content.openingLine || `Open this invitation from ${content.hostName || "someone special"}.`,
    robots: { index: false, follow: false },
    openGraph: { title: content.eventTitle || "You're invited", description: content.openingLine || "Tap to open your invitation.", images: content.coverImage?.startsWith("http") ? [content.coverImage] : undefined },
  };
}

export default async function Page({ params }: Props) {
  const { templateId, slug } = await params;
  const invitation = await getInvitation(slug);
  if (!invitation || invitation.template_id !== templateId) notFound();
  const server = createServerClient();
  const tier: InviteData["tier"] = invitation.plan_id === "FREE_AD_SUPPORTED" ? "FREE" : invitation.plan_id;
  const content = await resolveInvitationAssets(server, invitation.content);
  const data = { id: invitation.id, slug: invitation.slug, tier, ...(content as Omit<InviteData, "id" | "slug" | "tier">) } as InviteData;
  await (server.from("invitation_events") as any).insert({ invitation_id: invitation.id, event_type: "view", metadata: {} });
  return <PublishedInvitationClient templateId={templateId} data={data} />;
}
