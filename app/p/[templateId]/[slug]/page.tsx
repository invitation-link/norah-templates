"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import InvitationExperience from "@/app/components/invitation/InvitationExperience";
import { getTemplateById } from "@/app/components/templates/registry";
import { InviteData } from "@/app/components/templates/types";

function fallback(templateId: string, slug: string): InviteData {
  const type = templateId === "royal-wedding" ? "WEDDING" : templateId === "corporate-summit" ? "CORPORATE" : templateId === "casual-party" ? "CASUAL" : "BIRTHDAY";
  return {
    id: "published-preview", slug, type, tier: "FREE",
    eventTitle: type === "WEDDING" ? "Priya & Arjun" : "Aarav turns one",
    hostName: "With love, our family", eventDate: "2026-08-22T18:30",
    venueName: "The Courtyard", venueAddress: "12 Garden Road, Bengaluru",
    venueMapUrl: "https://maps.google.com", coverImage: "/images/WhatsApp Image 2025-12-31 at 8.37.16 PM.jpeg",
    galleryImages: ["/images/WhatsApp Image 2025-12-31 at 8.37.16 PM.jpeg"],
    primaryColor: "#E6A719", fontFamily: "Classic",
    message: "Come celebrate this beautiful moment with us.",
    closingMessage: "We cannot wait to celebrate with you.", rsvpLink: "https://wa.me/919876543210",
  };
}

export default function PublishedInvitationPage() {
  const { templateId: rawTemplateId, slug: rawSlug } = useParams<{ templateId: string; slug: string }>();
  const templateId = String(rawTemplateId);
  const slug = String(rawSlug);
  const template = getTemplateById(templateId);
  const [data] = useState<InviteData>(() => {
    const safe = fallback(templateId, slug);
    if (typeof window === "undefined") return safe;
    const saved = localStorage.getItem(`invite-link-published-${slug}`) || localStorage.getItem(`invite-link-draft-${templateId}`);
    if (!saved) return safe;
    try { return { ...safe, ...JSON.parse(saved), slug }; } catch { return safe; }
  });

  if (!template) return <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#fbf8f1", color: "#071a38" }}><div><h1>Invitation not found</h1><Link href="/create">Create an invitation</Link></div></main>;
  const TemplateComponent = template.component;
  return <main style={{ width: "100%", height: "100dvh", overflow: "hidden" }}><InvitationExperience data={data} TemplateComponent={TemplateComponent} mode="LIVE" /></main>;
}
