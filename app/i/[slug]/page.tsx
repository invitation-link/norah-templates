import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase";

export const metadata: Metadata = { title: "Invitation", robots: { index: false, follow: false } };

export default async function LegacyInvitation({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await (createServerClient().from("invitations") as any).select("slug,template_id,status").eq("slug", slug).eq("status", "PUBLISHED").maybeSingle();
  if (!data) notFound();
  redirect(`/p/${data.template_id}/${data.slug}`);
}
