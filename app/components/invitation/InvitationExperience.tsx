"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, MessageCircle, Sparkles, X } from "lucide-react";
import { ComponentType, CSSProperties, FormEvent, useEffect, useState } from "react";
import { InviteData, TemplateProps } from "@/app/components/templates/types";
import styles from "./InvitationExperience.module.css";
import { trackEvent } from "@/app/lib/analytics";
import InvitationSponsor from "./InvitationSponsor";

type Props = {
  data: InviteData;
  TemplateComponent: ComponentType<TemplateProps>;
  mode?: "PREVIEW" | "LIVE";
};

export default function InvitationExperience({ data, TemplateComponent, mode = "LIVE" }: Props) {
  const free = data.tier === "FREE";
  const [opened, setOpened] = useState(!free);
  const [showEndPromotion, setShowEndPromotion] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const timer = window.setTimeout(() => setShowEndPromotion(true), mode === "PREVIEW" ? 4500 : 9000);
    return () => window.clearTimeout(timer);
  }, [mode, opened]);

  const record = (event: string) => {
    if (typeof window === "undefined") return;
    const key = `invite-link-growth-${data.slug}`;
    const current = JSON.parse(localStorage.getItem(key) || "{}");
    localStorage.setItem(key, JSON.stringify({ ...current, [event]: (current[event] || 0) + 1 }));
    trackEvent(`invitation_${event}`, { invitation_type: data.type, plan: data.tier });
    const publicEvent = event === "opens" || event === "templateOpens" ? "open" : event === "closingClicks" ? "sponsor_click" : event === "rsvpOpen" ? "rsvp_open" : null;
    if (mode === "LIVE" && publicEvent) void fetch(`/api/public/invitations/${data.slug}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventType: publicEvent }) });
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "PREVIEW") { setRsvpSent(true); return; }
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/public/invitations/${data.slug}/rsvps`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName: form.get("guestName"), guestPhone: form.get("guestPhone"), attending: form.get("attending") === "yes", guestsCount: Number(form.get("guestsCount") || 1), message: form.get("message") }),
    });
    setSubmitting(false);
    setRsvpSent(response.ok);
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
        {opened && showEndPromotion && (
          <motion.aside className={styles.endPromotion} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}>
            <button className={styles.dismiss} type="button" onClick={() => setShowEndPromotion(false)} aria-label="Dismiss Invite Link promotion"><X size={17} /></button>
            {free ? <InvitationSponsor onHouseClick={() => record("closingClicks")} /> : <><span className={styles.mark}><MessageCircle size={17} /></span><div><small>Your reply is private</small><strong>Will you be there?</strong></div><button className={styles.endAction} type="button" onClick={() => { setShowRsvp(true); record("rsvpOpen"); }} aria-label="Reply to invitation"><MessageCircle size={18} /></button></>}
            {free && <button className={styles.rsvpTextButton} type="button" onClick={() => { setShowRsvp(true); record("rsvpOpen"); }}>Reply to the host</button>}
          </motion.aside>
        )}
      </AnimatePresence>

      {data.tier === "ESSENTIAL" && opened && <Link className={styles.essentialCredit} href="/" aria-label="Made with Invite Link">Made with Invite Link</Link>}

      <AnimatePresence>{showRsvp && <motion.div className={styles.rsvpBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.section className={styles.rsvpSheet} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
          <button type="button" className={styles.rsvpClose} onClick={() => setShowRsvp(false)} aria-label="Close RSVP"><X size={18} /></button>
          {rsvpSent ? <div className={styles.rsvpThanks}><span><Check size={22} /></span><h2 id="rsvp-title">Your reply is with the host.</h2><p>Thank you for taking a moment to respond.</p><button type="button" onClick={() => setShowRsvp(false)}>Back to invitation</button></div> : <form onSubmit={submitRsvp}>
            <small>Private RSVP</small><h2 id="rsvp-title">Will you be there?</h2><p>Your details are visible only to the invitation host.</p>
            <label>Your name<input name="guestName" required minLength={2} maxLength={100} /></label>
            <label>Phone (optional)<input name="guestPhone" type="tel" maxLength={20} /></label>
            <div className={styles.attendance}><label><input type="radio" name="attending" value="yes" defaultChecked /> Joyfully attending</label><label><input type="radio" name="attending" value="no" /> Cannot attend</label></div>
            <label>Number of guests<input name="guestsCount" type="number" min="0" max="20" defaultValue="1" /></label>
            <label>Message (optional)<textarea name="message" maxLength={500} rows={3} /></label>
            <button type="submit" disabled={submitting}>{submitting ? <Loader2 size={17} className={styles.spin} /> : <MessageCircle size={17} />} Send private reply</button>
          </form>}
        </motion.section>
      </motion.div>}</AnimatePresence>

      {mode === "PREVIEW" && opened && (
        <button className={styles.previewEndTrigger} type="button" onClick={() => setShowEndPromotion(true)}>Preview closing promotion</button>
      )}
    </div>
  );
}
