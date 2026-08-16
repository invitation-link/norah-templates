"use client";

import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./InvitationExperience.module.css";

declare global { interface Window { adsbygoogle?: unknown[] } }

export default function InvitationSponsor({ onHouseClick }: { onHouseClick: () => void }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;
  const enabled = process.env.NEXT_PUBLIC_AD_PROVIDER === "adsense" && Boolean(client && slot);
  const [consented, setConsented] = useState(false);
  useEffect(() => setConsented(localStorage.getItem("invite-link-analytics-consent") === "granted"), []);

  if (enabled && consented) return <div className={styles.adsenseSponsor}>
    <Script async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} onLoad={() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {} }} />
    <small>Sponsored</small>
    <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
  </div>;

  return <><span className={styles.mark}><Check size={17} /></span><div><small>Sponsored · Invite Link</small><strong>Create an invitation like this</strong></div><Link href="/create" onClick={onHouseClick} aria-label="Create your invitation"><ArrowRight size={18} /></Link></>;
}
