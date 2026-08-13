"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import { ComponentType, CSSProperties, useEffect, useState } from "react";
import { InviteData, TemplateProps } from "@/app/components/templates/types";
import styles from "./InvitationExperience.module.css";
import { trackEvent } from "@/app/lib/analytics";

type Props = {
  data: InviteData;
  TemplateComponent: ComponentType<TemplateProps>;
  mode?: "PREVIEW" | "LIVE";
};

export default function InvitationExperience({ data, TemplateComponent, mode = "LIVE" }: Props) {
  const free = data.tier === "FREE";
  const [opened, setOpened] = useState(!free);
  const [showEndPromotion, setShowEndPromotion] = useState(false);

  useEffect(() => {
    if (!opened || !free) return;
    const timer = window.setTimeout(() => setShowEndPromotion(true), mode === "PREVIEW" ? 4500 : 9000);
    return () => window.clearTimeout(timer);
  }, [free, mode, opened]);

  const record = (event: string) => {
    if (typeof window === "undefined") return;
    const key = `invite-link-growth-${data.slug}`;
    const current = JSON.parse(localStorage.getItem(key) || "{}");
    localStorage.setItem(key, JSON.stringify({ ...current, [event]: (current[event] || 0) + 1 }));
    trackEvent(`invitation_${event}`, { invitation_slug: data.slug, invitation_type: data.type, plan: data.tier });
  };

  return (
    <div className={styles.frame} style={{ "--invite-accent": data.primaryColor || "#E6A719" } as CSSProperties}>
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section key="promotion" className={styles.openingPromotion} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.02 }}>
            <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 }}>
              <Image src="/brand/invite-link-mark.png" alt="Invite Link" width={78} height={68} priority />
              <span>Made with Invite Link</span>
              <h1>A little moment<br />before the moment.</h1>
              <p>{data.eventTitle} has created something special for you.</p>
              <button type="button" onClick={() => { setOpened(true); record("opens"); }}>
                Open invitation <ArrowRight size={18} />
              </button>
              <Link href="/create" onClick={() => record("openingClicks")}>Create beautiful invitations like this</Link>
            </motion.div>
            <Sparkles className={styles.sparkleOne} aria-hidden="true" />
            <Sparkles className={styles.sparkleTwo} aria-hidden="true" />
          </motion.section>
        ) : (
          <motion.div key="template" className={styles.template} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TemplateComponent data={data} mode={mode} onInteraction={(type) => type === "OPENED" && record("templateOpens")} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {free && opened && showEndPromotion && (
          <motion.aside className={styles.endPromotion} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}>
            <button className={styles.dismiss} type="button" onClick={() => setShowEndPromotion(false)} aria-label="Dismiss Invite Link promotion"><X size={17} /></button>
            <span className={styles.mark}><Check size={17} /></span>
            <div><small>Loved this invitation?</small><strong>Create yours with Invite Link</strong></div>
            <Link href="/create" onClick={() => record("closingClicks")} aria-label="Create your invitation"><ArrowRight size={18} /></Link>
          </motion.aside>
        )}
      </AnimatePresence>

      {mode === "PREVIEW" && free && opened && (
        <button className={styles.previewEndTrigger} type="button" onClick={() => setShowEndPromotion(true)}>Preview closing promotion</button>
      )}
    </div>
  );
}
