"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Crown, ExternalLink, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { PRODUCT_TEMPLATES, ProductOccasion } from "@/app/lib/product-templates";
import styles from "./Templates.module.css";

const filters: Array<{ id: "ALL" | ProductOccasion; label: string }> = [
  { id: "ALL", label: "All" }, { id: "BIRTHDAY", label: "Birthday" }, { id: "WEDDING", label: "Wedding" },
  { id: "HOUSEWARMING", label: "Housewarming" }, { id: "CELEBRATION", label: "Celebration" }, { id: "CORPORATE", label: "Corporate" },
];

export default function TemplatesPage() {
  const [filter, setFilter] = useState<"ALL" | ProductOccasion>("ALL");
  const templates = useMemo(() => filter === "ALL" ? PRODUCT_TEMPLATES : PRODUCT_TEMPLATES.filter((item) => item.occasion === filter), [filter]);
  return <main className={styles.page}>
    <header><Link href="/" className={styles.back}><ArrowLeft size={17} /> Home</Link><Link href="/" className={styles.brand}><Image src="/brand/invite-link-mark.png" alt="" width={510} height={445} /><span>invite <strong>Link</strong></span></Link><Link href="/create" className={styles.create}>Create an invite <ArrowRight size={17} /></Link></header>
    <section className={styles.intro}><span>Template collection</span><h1>Experiences for<br />every kind of moment.</h1><p>Each preview below is captured from the real opening screen of the template you will customize.</p></section>
    <section className={styles.collection}>
      <div className={styles.filters} role="group" aria-label="Filter templates">{filters.map((item) => <button type="button" key={item.id} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} className={filter === item.id ? styles.active : ""}>{item.label}</button>)}</div>
      <div className={styles.grid}>{templates.map((template) => <article key={template.id}>
        <div className={styles.media}><Image src={template.previewImage} alt={`${template.name} actual opening screen`} fill sizes="(max-width: 760px) 100vw, 50vw" /><span>{template.tier === "PREMIUM" && <Crown size={13} />}{template.tier}</span><a href={template.liveUrl} target="_blank" rel="noreferrer"><Play size={17} fill="currentColor" /> Experience live</a></div>
        <div className={styles.meta}><div><span>{template.occasionLabel}</span><h2><Link href={`/templates/${template.id}`}>{template.name}</Link></h2><p>{template.description}</p><small>{template.interaction}</small></div>{template.editorUrl ? <Link href={template.editorUrl}>Customize <ArrowRight size={17} /></Link> : <Link href={`/templates/${template.id}`}>Details <ExternalLink size={16} /></Link>}</div>
      </article>)}</div>
    </section>
    <section className={styles.cta}><span>Found your feeling?</span><h2>Make it personal.</h2><Link href="/create">Start creating <ArrowRight size={18} /></Link></section>
  </main>;
}
