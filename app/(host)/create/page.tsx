"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CakeSlice, Crown, ExternalLink, Heart, House, PartyPopper, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { PRODUCT_TEMPLATES, ProductOccasion } from "@/app/lib/product-templates";
import styles from "./Create.module.css";

const occasions: Array<{ id: "ALL" | ProductOccasion; label: string; note: string; icon: typeof CakeSlice }> = [
  { id: "ALL", label: "All", note: "See every experience", icon: Crown },
  { id: "BIRTHDAY", label: "Birthday", note: "Joyful reveals", icon: CakeSlice },
  { id: "WEDDING", label: "Wedding", note: "Romantic beginnings", icon: Heart },
  { id: "HOUSEWARMING", label: "Housewarming", note: "A warm welcome", icon: House },
  { id: "CELEBRATION", label: "Celebration", note: "Big energy", icon: PartyPopper },
  { id: "CORPORATE", label: "Corporate", note: "Polished events", icon: BriefcaseBusiness },
];

export default function CreatePage() {
  const [occasion, setOccasion] = useState<"ALL" | ProductOccasion>("ALL");
  const filtered = useMemo(
    () => occasion === "ALL" ? PRODUCT_TEMPLATES : PRODUCT_TEMPLATES.filter((template) => template.occasion === occasion),
    [occasion],
  );

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div><span>New invitation</span><h1>What are we celebrating?</h1></div>
        <p>Choose the occasion, then experience the template exactly as your guests will.</p>
      </div>

      <ol className={styles.progress} aria-label="Invitation creation progress">
        <li className={styles.current}><span>1</span> Occasion</li>
        <li><span>2</span> Template</li>
        <li><span>3</span> Personalize</li>
        <li><span>4</span> Publish</li>
      </ol>

      <section className={styles.occasionGrid} aria-label="Choose an occasion">
        {occasions.map(({ id, label, note, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setOccasion(id)} className={occasion === id ? styles.selectedOccasion : ""} aria-pressed={occasion === id}>
            <Icon aria-hidden="true" />
            <strong>{label}</strong>
            <span>{note}</span>
          </button>
        ))}
      </section>

      <section className={styles.gallery}>
        <div className={styles.galleryHeading}>
          <div><span>Step 02</span><h2>Choose an experience</h2></div>
          <p>{filtered.length} template{filtered.length === 1 ? "" : "s"} for this occasion</p>
        </div>
        <motion.div layout className={styles.templateGrid}>
          {filtered.map((template) => (
            <motion.article layout key={template.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.media}>
                <Image src={template.previewImage} alt={`${template.name} actual opening screen`} fill sizes="(max-width: 760px) 100vw, 33vw" />
                <span className={styles.tier}>{template.tier === "PREMIUM" && <Crown size={13} aria-hidden="true" />}{template.tier}</span>
                <a href={template.liveUrl} target="_blank" rel="noreferrer" className={styles.previewLink}>
                  <Play size={17} fill="currentColor" aria-hidden="true" /> Live preview
                </a>
              </div>
              <div className={styles.meta}>
                <span>{template.occasionLabel}</span>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className={styles.interaction}><Play size={14} aria-hidden="true" /> {template.interaction}</div>
                {template.editorUrl ? (
                  template.editorUrl.startsWith("http") ? (
                    <a className={styles.useButton} href={template.editorUrl} target="_blank" rel="noreferrer">
                      Customize template <ExternalLink size={17} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link className={styles.useButton} href={template.editorUrl}>
                      Use this template <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  )
                ) : (
                  <button type="button" className={styles.unavailable} disabled>Preview template</button>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
