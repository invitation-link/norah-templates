"use client";

import Link from "next/link";
import InvitationExperience from "@/app/components/invitation/InvitationExperience";
import { getTemplateById } from "@/app/components/templates/registry";
import type { InviteData } from "@/app/components/templates/types";

export default function PublishedInvitationClient({ templateId, data }: { templateId: string; data: InviteData }) {
  const template = getTemplateById(templateId);
  if (!template) return <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#fbf8f1", color: "#071a38" }}><div><h1>Invitation not found</h1><Link href="/create">Create an invitation</Link></div></main>;
  return <main style={{ width: "100%", height: "100dvh", overflow: "hidden" }}><InvitationExperience data={data} TemplateComponent={template.component} mode="LIVE" /></main>;
}
