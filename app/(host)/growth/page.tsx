"use client";

import Link from "next/link";
import { ArrowRight, Eye, Megaphone, MousePointerClick, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import styles from "./Growth.module.css";

type Totals = { opens: number; openingClicks: number; closingClicks: number; templateOpens: number };

export default function GrowthPage() {
  const [totals] = useState<Totals>(() => {
    const fallback = { opens: 128, openingClicks: 14, closingClicks: 9, templateOpens: 102 };
    if (typeof window === "undefined") return fallback;
    const measured: Totals = { opens: 0, openingClicks: 0, closingClicks: 0, templateOpens: 0 };
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith("invite-link-growth-")) continue;
      try {
        const item = JSON.parse(localStorage.getItem(key) || "{}");
        (Object.keys(measured) as (keyof Totals)[]).forEach((metric) => { measured[metric] += Number(item[metric] || 0); });
      } catch { /* Ignore damaged local analytics. */ }
    }
    return measured.opens > 0 ? measured : fallback;
  });

  const clicks = totals.openingClicks + totals.closingClicks;
  const rate = totals.opens ? Math.round((clicks / totals.opens) * 100) : 0;

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <div><span>Built-in distribution</span><h1>Your invitation is the advertisement.</h1><p>Free invitations introduce Invite Link at two respectful moments—never between the host and their guests.</p></div>
        <Link href="/create">Create a free invitation <ArrowRight size={18} /></Link>
      </header>

      <section className={styles.metrics} aria-label="Promotion performance">
        <div><Eye /><span>Promotion opens</span><strong>{totals.opens}</strong><small>Guests who saw the opening</small></div>
        <div><MousePointerClick /><span>Create-yours clicks</span><strong>{clicks}</strong><small>Opening and closing combined</small></div>
        <div><TrendingUp /><span>Discovery rate</span><strong>{rate}%</strong><small>Guest opens converted to interest</small></div>
      </section>

      <section className={styles.inventory}>
        <div className={styles.sectionHeading}><span>Free plan inventory</span><h2>Two moments. One consistent story.</h2></div>
        <article className={styles.openCreative}>
          <div className={styles.creativeCopy}><small>Moment 01 · before opening</small><Sparkles /><h3>A little moment<br />before the moment.</h3><p>Made with Invite Link</p><button type="button">Open invitation <ArrowRight size={16} /></button></div>
          <div className={styles.reason}><strong>Why it works</strong><p>The brand introduction feels like a title card, not an interruption. The guest remains focused on the invitation they came to see.</p></div>
        </article>
        <article className={styles.closeCreative}>
          <div><Megaphone /><span><small>Loved this invitation?</small><strong>Create yours with Invite Link</strong></span><ArrowRight /></div>
          <p>Appears after the emotional experience and can always be dismissed.</p>
        </article>
      </section>

      <section className={styles.policy}>
        <div><span>Product policy</span><h2>No banners. No third-party ads. No broken emotion.</h2></div>
        <p>Premium removes both promotional moments. Free keeps the complete invitation and turns guest delight into organic discovery for Invite Link.</p>
      </section>
    </div>
  );
}
