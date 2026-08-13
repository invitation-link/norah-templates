import type { Metadata } from "next";
import JsonLd, { schemas } from "@/app/components/seo/JsonLd";
import { PRODUCT_TEMPLATES } from "@/app/lib/product-templates";
import { SITE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Interactive Digital Invitation Templates",
  description: "Preview interactive wedding, birthday, housewarming and celebration invitations, then personalize and publish one WhatsApp-ready link.",
  alternates: { canonical: `${SITE_URL}/templates` },
  openGraph: { url: `${SITE_URL}/templates`, title: "Interactive Digital Invitation Templates | Invite Link", description: "Choose a feeling, experience the real template and make it yours.", images: ["/images/invite-link-og.png"] },
  twitter: { card: "summary_large_image", title: "Digital Invitation Templates | Invite Link", description: "Interactive invitation experiences for weddings, birthdays and housewarmings.", images: ["/images/invite-link-og.png"] },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  const items = PRODUCT_TEMPLATES.map((template) => ({ name: template.name, url: template.liveUrl.startsWith("/") ? `${SITE_URL}${template.liveUrl}` : template.liveUrl, image: `${SITE_URL}${template.previewImage}` }));
  return <><JsonLd data={[schemas.breadcrumb([{ name: "Home", url: SITE_URL }, { name: "Templates", url: `${SITE_URL}/templates` }]), schemas.itemList("Interactive invitation templates", items)]} />{children}</>;
}
