"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Copy, ExternalLink, Eye, MessageCircle, MoreHorizontal, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./Dashboard.module.css";

type DashboardInvite = {
  id: string;
  title: string;
  template: string;
  date: string;
  image: string;
  status: "LIVE" | "DRAFT";
  views: number;
  replies: number;
  url: string;
  editor: string;
};

const starterInvites: DashboardInvite[] = [
  { id: "1", title: "Aarav turns one", template: "Golden Unboxing", date: "22 August 2026", image: "/images/templates/live/ganishka-original.png", status: "LIVE", views: 128, replies: 42, url: "/u/ganishka-original", editor: "/editor/ganishka-original" },
  { id: "2", title: "Priya & Arjun", template: "Royal Vows", date: "18 December 2026", image: "/images/templates/live/royal-wedding.png", status: "DRAFT", views: 0, replies: 0, url: "/u/royal-wedding", editor: "/editor/royal-wedding" },
];

export default function DashboardPage() {
  const [invites, setInvites] = useState(starterInvites);

  const copy = async (invite: DashboardInvite) => {
    const url = `${window.location.origin}${invite.url}`;
    await navigator.clipboard.writeText(url);
    toast.success("Invitation link copied");
  };
  const duplicate = (invite: DashboardInvite) => {
    setInvites((items) => [...items, { ...invite, id: `${Date.now()}`, title: `${invite.title} copy`, status: "DRAFT", views: 0, replies: 0 }]);
    toast.success("Invitation duplicated");
  };

  const liveCount = invites.filter((invite) => invite.status === "LIVE").length;
  const totalViews = invites.reduce((total, invite) => total + invite.views, 0);

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div><span>Workspace</span><h1>My invitations</h1><p>View, edit and share every invitation from one calm place.</p></div>
        <Link href="/create"><Plus size={18} /> Create invitation</Link>
      </div>

      <section className={styles.metrics} aria-label="Invitation summary">
        <div><span>Invitations</span><strong>{invites.length}</strong><small>{liveCount} live</small></div>
        <div><span>Total views</span><strong>{totalViews}</strong><small>Across published links</small></div>
        <div><span>Guest replies</span><strong>{invites.reduce((total, invite) => total + invite.replies, 0)}</strong><small>Via WhatsApp</small></div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeading}><h2>Recent invitations</h2><span>Updated just now</span></div>
        <div className={styles.list}>
          {invites.map((invite) => (
            <article key={invite.id}>
              <div className={styles.thumbnail}><Image src={invite.image} alt={`${invite.template} opening screen`} fill sizes="150px" /></div>
              <div className={styles.identity}><span className={invite.status === "LIVE" ? styles.live : styles.draft}>{invite.status}</span><h3>{invite.title}</h3><p>{invite.template}</p></div>
              <div className={styles.date}><CalendarDays size={17} /><span>{invite.date}</span></div>
              <div className={styles.activity}><span><Eye size={16} /> {invite.views}</span><span><MessageCircle size={16} /> {invite.replies}</span></div>
              <div className={styles.actions}>
                <Link href={invite.url} target="_blank" aria-label={`View ${invite.title}`}><ExternalLink size={17} /></Link>
                <button type="button" onClick={() => copy(invite)} aria-label={`Copy link for ${invite.title}`}><Share2 size={17} /></button>
                <Link href={invite.editor}>Edit</Link>
                <button type="button" onClick={() => duplicate(invite)} aria-label={`Duplicate ${invite.title}`}><Copy size={17} /></button>
                <button type="button" aria-label={`More options for ${invite.title}`}><MoreHorizontal size={18} /></button>
              </div>
            </article>
          ))}
          <Link href="/create" className={styles.newRow}><span><Plus size={20} /></span><div><strong>Create another invitation</strong><small>Start with an occasion and a live template</small></div></Link>
        </div>
      </section>
    </div>
  );
}
