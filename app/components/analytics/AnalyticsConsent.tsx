"use client";

import { useSyncExternalStore } from "react";
import styles from "./AnalyticsConsent.module.css";
import Link from "next/link";

const KEY = "invite-link-analytics-consent";
const EVENT = "invite-link-consent-change";

function subscribe(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(EVENT, listener); window.removeEventListener("storage", listener); };
}

function getSnapshot() { return localStorage.getItem(KEY) || "unset"; }
function getServerSnapshot() { return "unset"; }

export default function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (consent !== "unset") return null;

  const choose = (granted: boolean) => {
    const value = granted ? "granted" : "denied";
    localStorage.setItem(KEY, value);
    window.gtag?.("consent", "update", { analytics_storage: value, ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.clarity?.("consentv2", { source: "InviteLink", ad_Storage: "denied", analytics_Storage: value });
    if (granted) window.gtag?.("event", "page_view", { page_title: document.title, page_location: `${window.location.origin}${window.location.pathname}`, page_path: window.location.pathname });
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <aside className={styles.banner} aria-label="Analytics preferences">
      <div><strong>Help us improve Invite Link</strong><p>Allow anonymous usage analytics and session insights. Free invitations may show a contextual house promotion; third-party advertising stays off unless separately enabled with appropriate consent. <Link href="/privacy">Privacy</Link></p></div>
      <div><button type="button" onClick={() => choose(false)}>Decline</button><button type="button" onClick={() => choose(true)}>Allow analytics</button></div>
    </aside>
  );
}
