"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clipboard, ExternalLink, Eye, MessageCircle, Plus, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/components/providers/AuthProvider";
import { LoginModal } from "@/app/components/ui/LoginModal";
import styles from "./Dashboard.module.css";

type Row = {
  id: string; template_id: string; slug: string; plan_id: string; status: "DRAFT" | "PAYMENT_PENDING" | "PUBLISHED" | "ARCHIVED";
  content: { eventTitle?: string; eventDate?: string; coverImage?: string };
  rsvps?: { count: number }[]; invitation_events?: { count: number }[];
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [invites, setInvites] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); setShowLogin(true); return; }
    apiFetch("/api/invitations").then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setInvites(body.invitations || []);
    }).catch(() => toast.error("Could not load your invitations")).finally(() => setLoading(false));
  }, [authLoading, user]);

  const liveCount = invites.filter((invite) => invite.status === "PUBLISHED").length;
  const totals = useMemo(() => invites.reduce((value, invite) => ({ views: value.views + (invite.invitation_events?.[0]?.count || 0), replies: value.replies + (invite.rsvps?.[0]?.count || 0) }), { views: 0, replies: 0 }), [invites]);
  const copy = async (invite: Row) => {
    const url = `${window.location.origin}/p/${invite.template_id}/${invite.slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Invitation link copied");
  };

  return <div className={styles.page}>
    <div className={styles.heading}>
      <div><span>Workspace</span><h1>My invitations</h1><p>Every draft, published link and guest reply in one place.</p></div>
      <Link href="/create"><Plus size={18} /> Create invitation</Link>
    </div>
    <section className={styles.metrics} aria-label="Invitation summary">
      <div><span>Invitations</span><strong>{invites.length}</strong><small>{liveCount} live</small></div>
      <div><span>Total opens</span><strong>{totals.views}</strong><small>Across published links</small></div>
      <div><span>Guest replies</span><strong>{totals.replies}</strong><small>Private to your account</small></div>
    </section>
    <section className={styles.listSection}>
      <div className={styles.listHeading}><h2>Recent invitations</h2><span>{loading ? "Loading…" : "Synced securely"}</span></div>
      <div className={styles.list}>
        {!loading && invites.map((invite) => {
          const live = invite.status === "PUBLISHED";
          const url = `/p/${invite.template_id}/${invite.slug}`;
          return <article key={invite.id}>
            <div className={styles.thumbnail}><Image src={invite.content.coverImage || "/images/templates/live/ganishka-original.png"} alt="" fill sizes="150px" /></div>
            <div className={styles.identity}><span className={live ? styles.live : styles.draft}>{invite.status.replace("_", " ")}</span><h3>{invite.content.eventTitle || "Untitled invitation"}</h3><p>{invite.plan_id.replaceAll("_", " ")}</p></div>
            <div className={styles.date}><CalendarDays size={17} /><span>{invite.content.eventDate ? new Date(invite.content.eventDate).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Date not set"}</span></div>
            <div className={styles.activity}><span><Eye size={16} /> {invite.invitation_events?.[0]?.count || 0}</span><span><MessageCircle size={16} /> {invite.rsvps?.[0]?.count || 0}</span></div>
            <div className={styles.actions}>
              {live && <Link href={url} target="_blank" aria-label="View invitation"><ExternalLink size={17} /></Link>}
              {live && <button type="button" onClick={() => copy(invite)} aria-label="Copy invitation link"><Share2 size={17} /></button>}
              <Link href={`/editor/${invite.template_id}?invitation=${invite.id}`}>Edit</Link>
              <button type="button" onClick={() => navigator.clipboard.writeText(invite.id).then(() => toast.success("Invitation ID copied"))} aria-label="Copy invitation ID"><Clipboard size={17} /></button>
            </div>
          </article>;
        })}
        {!loading && !invites.length && <div style={{ padding: "2rem", textAlign: "center" }}><h3>No invitations yet</h3><p>Choose a live design and make it yours.</p></div>}
        <Link href="/create" className={styles.newRow}><span><Plus size={20} /></span><div><strong>Create another invitation</strong><small>Start with an occasion and a live template</small></div></Link>
      </div>
    </section>
    <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} redirectTo="/dashboard" />
  </div>;
}
