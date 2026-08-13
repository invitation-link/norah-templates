import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";
import JsonLd, { schemas } from "@/app/components/seo/JsonLd";
import { PRODUCT_TEMPLATES, ProductOccasion } from "@/app/lib/product-templates";
import { SITE_URL } from "@/app/lib/site";
import styles from "./Occasion.module.css";

const occasions = {
  birthday: { label: "Birthday", type: "BIRTHDAY" as ProductOccasion, title: "Interactive birthday invitations that begin with surprise.", description: "Create a birthday invitation guests can tap, reveal and remember—complete with photos, party details and WhatsApp RSVP.", keyword: "interactive birthday invitation" },
  wedding: { label: "Wedding", type: "WEDDING" as ProductOccasion, title: "Digital wedding invitations with a sense of ceremony.", description: "Personalize an elegant interactive wedding invitation with your names, story, venue and RSVP, then share one beautiful link.", keyword: "digital wedding invitation" },
  housewarming: { label: "Housewarming", type: "HOUSEWARMING" as ProductOccasion, title: "Open the door to your new beginning.", description: "Create a warm interactive housewarming or Griha Pravesh invitation with directions, family details and a cinematic opening.", keyword: "housewarming invitation online" },
  celebrations: { label: "Celebration", type: "CELEBRATION" as ProductOccasion, title: "Invitation experiences for every reason to celebrate.", description: "Turn anniversaries, parties and milestones into an interactive invitation link made for effortless WhatsApp sharing.", keyword: "online celebration invitation" },
} as const;

export function generateStaticParams() { return Object.keys(occasions).map((occasion) => ({ occasion })); }

export async function generateMetadata({ params }: { params: Promise<{ occasion: string }> }): Promise<Metadata> {
  const { occasion } = await params;
  const item = occasions[occasion as keyof typeof occasions];
  if (!item) return { title: "Invitation Occasion" };
  const url = `${SITE_URL}/occasions/${occasion}`;
  return {
    title: `${item.label} Invitation Maker`, description: item.description,
    keywords: [item.keyword, `${item.label.toLowerCase()} invitation maker`, `${item.label.toLowerCase()} WhatsApp invitation`],
    alternates: { canonical: url },
    openGraph: { url, title: `${item.label} Invitations | Invite Link`, description: item.description, images: ["/images/invite-link-og.png"] },
  };
}

export default async function OccasionPage({ params }: { params: Promise<{ occasion: string }> }) {
  const { occasion } = await params;
  const item = occasions[occasion as keyof typeof occasions];
  if (!item) return null;
  const templates = PRODUCT_TEMPLATES.filter((template) => template.occasion === item.type);
  const url = `${SITE_URL}/occasions/${occasion}`;
  const schemaItems = templates.map((template) => ({ name: template.name, url: template.liveUrl.startsWith("/") ? `${SITE_URL}${template.liveUrl}` : template.liveUrl, image: `${SITE_URL}${template.previewImage}` }));
  return (
    <main className={styles.page}>
      <JsonLd data={[schemas.breadcrumb([{ name: "Home", url: SITE_URL }, { name: `${item.label} invitations`, url }]), schemas.itemList(`${item.label} invitation templates`, schemaItems)]} />
      <nav><Link href="/">Invite Link</Link><Link href="/templates">All templates</Link></nav>
      <header><span>{item.label} invitations</span><h1>{item.title}</h1><p>{item.description}</p><Link href="/create">Create your invitation <ArrowRight /></Link></header>
      <section className={styles.proof} aria-label="Invite Link benefits"><span><Check />No design skills needed</span><span><Check />Exact live preview</span><span><Check />Made for WhatsApp</span></section>
      <section className={styles.templates}>
        <div><span>Interactive templates</span><h2>Choose how the moment begins.</h2></div>
        <div className={styles.grid}>{templates.map((template) => <article key={template.id}><div><Image src={template.previewImage} alt={`${template.name} ${item.label.toLowerCase()} invitation opening`} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><span>{template.interaction}</span><h3>{template.name}</h3><p>{template.description}</p><a href={template.liveUrl} target={template.liveUrl.startsWith("http") ? "_blank" : undefined} rel={template.liveUrl.startsWith("http") ? "noreferrer" : undefined}><Play /> Preview experience</a></article>)}</div>
      </section>
      <section className={styles.copy}><div><span>Choose. Personalize. Share.</span><h2>An invitation link, not another attachment.</h2></div><p>Guests open it directly in their browser. You keep control of the names, date, venue, photos and message while Invite Link protects the composition, animation and mobile experience.</p></section>
      <footer><h2>Make the invitation part of the memory.</h2><Link href="/create">Start creating <ArrowRight /></Link><Link href="/privacy">Privacy</Link></footer>
    </main>
  );
}
