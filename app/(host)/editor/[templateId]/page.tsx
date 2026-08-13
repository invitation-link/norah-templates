"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, Clipboard, Crown, ExternalLink,
  ImagePlus, Link2, MapPin, MessageCircle, Palette, Play, Save, Send, Sparkles,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import InvitationExperience from "@/app/components/invitation/InvitationExperience";
import { useAuth } from "@/app/components/providers/AuthProvider";
import { LoginModal } from "@/app/components/ui/LoginModal";
import { trackEvent } from "@/app/lib/analytics";
import { getTemplateById } from "@/app/components/templates/registry";
import { InviteData } from "@/app/components/templates/types";
import styles from "./Editor.module.css";

const steps = ["Details", "Place", "Story & media", "Style", "Review", "Plan", "Publish"];
const sampleImages = [
  "/images/WhatsApp Image 2025-12-31 at 8.37.16 PM.jpeg",
  "/images/WhatsApp Image 2026-01-01 at 12.41.31 AM.jpeg",
  "/images/WhatsApp Image 2026-01-01 at 12.43.20 AM.jpeg",
];

function defaultDraft(templateId: string): InviteData {
  const type = templateId === "royal-wedding" ? "WEDDING" : templateId === "corporate-summit" ? "CORPORATE" : templateId === "casual-party" ? "CASUAL" : "BIRTHDAY";
  return {
    id: "draft",
    slug: "my-invitation",
    type,
    tier: "FREE",
    eventTitle: type === "WEDDING" ? "Priya & Arjun" : type === "CORPORATE" ? "Future Makers Summit" : type === "CASUAL" ? "Saturday After Dark" : "Aarav turns one",
    hostName: type === "WEDDING" ? "The Sharma & Reddy families" : "With love, our family",
    coHostName: type === "WEDDING" ? "Priya & Arjun" : "",
    familyName: type === "WEDDING" ? "Together with their families" : "The Mehta family",
    eventDate: "2026-08-22T18:30",
    venueName: "The Courtyard",
    venueAddress: "12 Garden Road, Bengaluru",
    venueMapUrl: "https://maps.google.com",
    coverImage: sampleImages[0],
    galleryImages: sampleImages,
    musicUrl: "/music/birthday-music.mp3",
    primaryColor: "#E6A719",
    fontFamily: "Classic",
    message: "Come celebrate this beautiful moment with us. Your presence will make it complete.",
    openingLine: "A beautiful moment is waiting for you.",
    quote: "The best memories are the ones we make together.",
    closingMessage: "We cannot wait to celebrate with you.",
    themeVariant: "IVORY",
    language: "English",
    rsvpPhone: "+91 98765 43210",
    rsvpLink: "https://wa.me/919876543210",
  };
}

function initialDraft(templateId: string): InviteData {
  const safe = defaultDraft(templateId);
  if (typeof window === "undefined") return safe;
  try { return { ...safe, ...JSON.parse(localStorage.getItem(`invite-link-draft-${templateId}`) || "{}") }; }
  catch { return safe; }
}

export default function EditorPage() {
  const { templateId: rawTemplateId } = useParams<{ templateId: string }>();
  const templateId = String(rawTemplateId);
  const template = getTemplateById(templateId);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<InviteData>(() => initialDraft(templateId));
  const [published, setPublished] = useState(false);
  const [fontChoice, setFontChoice] = useState(draft.fontFamily || "Classic");
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const timer = window.setTimeout(() => localStorage.setItem(`invite-link-draft-${templateId}`, JSON.stringify(draft)), 350);
    return () => window.clearTimeout(timer);
  }, [draft, templateId]);

  useEffect(() => {
    trackEvent("editor_step_view", { template_id: templateId, step_number: step + 1, step_name: steps[step] });
  }, [step, templateId]);

  const TemplateComponent = template?.component;
  const shareUrl = useMemo(() => typeof window === "undefined" ? `/p/${templateId}/${draft.slug}` : `${window.location.origin}/p/${templateId}/${draft.slug}`, [draft.slug, templateId]);

  const update = <K extends keyof InviteData>(key: K, value: InviteData[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));
  const saveDraft = () => {
    localStorage.setItem(`invite-link-draft-${templateId}`, JSON.stringify(draft));
    trackEvent("draft_saved", { template_id: templateId, step_number: step + 1 });
    toast.success("Draft saved on this device");
  };
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Invite link copied");
  };
  const uploadCover = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Choose an image under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => update("coverImage", String(reader.result));
    reader.readAsDataURL(file);
  };
  const finalizePublish = () => {
    localStorage.setItem(`invite-link-published-${draft.slug}`, JSON.stringify({ ...draft, templateId, publishedAt: new Date().toISOString() }));
    setPublished(true);
    trackEvent("invitation_published", { template_id: templateId, plan: draft.tier, invitation_type: draft.type });
  };
  const publish = () => {
    const authEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    if (authEnabled && !user) { setShowLogin(true); return; }
    finalizePublish();
  };

  if (!template || !TemplateComponent) {
    return <div className={styles.notFound}><h1>Template not found</h1><Link href="/create">Choose another template</Link></div>;
  }

  return (
    <div className={styles.editor}>
      <aside className={styles.panel}>
        <div className={styles.editorTop}>
          <Link href="/create" aria-label="Back to templates"><ArrowLeft size={19} /></Link>
          <div><span>Personalizing</span><strong>{template.name}</strong></div>
          <button type="button" onClick={saveDraft}><Save size={17} /> Save</button>
        </div>

        <ol className={styles.stepper} aria-label="Customization progress">
          {steps.map((label, index) => (
            <li key={label} className={index === step ? styles.activeStep : index < step ? styles.doneStep : ""}>
              <button type="button" onClick={() => setStep(index)} aria-current={index === step ? "step" : undefined}>
                <span>{index < step ? <Check size={13} /> : index + 1}</span><em>{label}</em>
              </button>
            </li>
          ))}
        </ol>

        <div className={styles.formArea}>
          <AnimatePresence mode="wait">
            <motion.section key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: .2 }}>
              {step === 0 && <>
                <ScreenHeading number="01" title="The essential details" note="Start with what your guest needs to know." />
                <Field label="Invitation title" value={draft.eventTitle} onChange={(value) => update("eventTitle", value)} placeholder="Aarav turns one" />
                <Field label="Who is inviting?" value={draft.hostName} onChange={(value) => update("hostName", value)} placeholder="With love, the Mehta family" />
                <div className={styles.fieldPair}>
                  <Field label="Co-host or couple names" value={draft.coHostName || ""} onChange={(value) => update("coHostName", value)} placeholder="Priya & Arjun" />
                  <Field label="Family line" value={draft.familyName || ""} onChange={(value) => update("familyName", value)} placeholder="Together with their families" />
                </div>
                <Field label="Date and time" type="datetime-local" value={draft.eventDate} onChange={(value) => update("eventDate", value)} />
                <Field label="RSVP phone" type="tel" value={draft.rsvpPhone || ""} onChange={(value) => update("rsvpPhone", value)} placeholder="+91 98765 43210" />
                <Field label="WhatsApp RSVP link" value={draft.rsvpLink || ""} onChange={(value) => update("rsvpLink", value)} placeholder="https://wa.me/91..." hint="Guests use this for a simple one-tap response." />
              </>}

              {step === 1 && <>
                <ScreenHeading number="02" title="Where should they arrive?" note="Give guests a clear place and one-tap directions." />
                <Field label="Venue name" value={draft.venueName} onChange={(value) => update("venueName", value)} placeholder="The Courtyard" />
                <Field label="Full address" value={draft.venueAddress} onChange={(value) => update("venueAddress", value)} placeholder="12 Garden Road, Bengaluru" multiline />
                <Field label="Google Maps link" value={draft.venueMapUrl} onChange={(value) => update("venueMapUrl", value)} placeholder="https://maps.app.goo.gl/..." />
                <div className={styles.locationNote}><MapPin size={18} /><p><strong>Guest experience</strong><span>Directions open outside the invitation without losing their place.</span></p></div>
              </>}

              {step === 2 && <>
                <ScreenHeading number="03" title="Make it unmistakably yours" note="Add one message, a few photographs and optional music." />
                <Field label="Opening line" value={draft.openingLine || ""} onChange={(value) => update("openingLine", value)} placeholder="A beautiful moment is waiting for you." />
                <Field label="Opening message" value={draft.message || ""} onChange={(value) => update("message", value)} placeholder="Come celebrate with us..." multiline />
                <Field label="Quote or blessing" value={draft.quote || ""} onChange={(value) => update("quote", value)} placeholder="The best memories are the ones we make together." multiline />
                <Field label="Closing message" value={draft.closingMessage || ""} onChange={(value) => update("closingMessage", value)} placeholder="We cannot wait to celebrate with you." multiline />
                <label className={styles.uploadField}><span>Hero photograph</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadCover(event.target.files?.[0])} /><strong><ImagePlus size={17} /> Choose your photo</strong><small>JPG, PNG or WebP · maximum 5 MB</small></label>
                <fieldset className={styles.mediaPicker}><legend>Choose gallery photos</legend><div>{sampleImages.map((src) => {
                  const selected = draft.galleryImages.includes(src);
                  return <button key={src} type="button" onClick={() => update("galleryImages", selected ? draft.galleryImages.filter((image) => image !== src) : [...draft.galleryImages, src])} aria-pressed={selected}><Image src={src} alt="Sample invitation photo" fill sizes="120px" />{selected && <span><Check size={15} /></span>}</button>;
                })}</div><p><ImagePlus size={15} /> Uploads will connect to Supabase Storage when credentials are added.</p></fieldset>
                <Field label="Background music URL" value={draft.musicUrl || ""} onChange={(value) => update("musicUrl", value)} placeholder="/music/your-track.mp3" hint="Music begins only after the guest interacts." />
              </>}

              {step === 3 && <>
                <ScreenHeading number="04" title="Choose a controlled variation" note="The template keeps its composition; you choose the mood." />
                <fieldset className={styles.themeOptions}><legend>Accent</legend><div>{[
                  ["#E6A719", "Signature gold"], ["#071A38", "Midnight navy"], ["#F2CC69", "Soft gold"], ["#FFFFFF", "Ivory light"],
                ].map(([color, label]) => <button type="button" key={color} onClick={() => update("primaryColor", color)} className={draft.primaryColor === color ? styles.chosenTheme : ""}><i style={{ background: color }} /><span>{label}</span>{draft.primaryColor === color && <Check size={16} />}</button>)}</div></fieldset>
                <fieldset className={styles.fontOptions}><legend>Type personality</legend><div>{["Classic", "Modern", "Elegant"].map((choice) => <button type="button" key={choice} onClick={() => { setFontChoice(choice); update("fontFamily", choice); }} className={fontChoice === choice ? styles.chosenFont : ""}><strong className={styles[`font${choice}`]}>{choice}</strong><span>{fontChoice === choice && <Check size={15} />}</span></button>)}</div></fieldset>
                <fieldset className={styles.fontOptions}><legend>Language</legend><div>{["English", "Hindi", "Telugu"].map((choice) => <button type="button" key={choice} onClick={() => update("language", choice as InviteData["language"])} className={draft.language === choice ? styles.chosenFont : ""}><strong>{choice}</strong><span>{draft.language === choice && <Check size={15} />}</span></button>)}</div></fieldset>
                <div className={styles.controlledNote}><Palette size={18} /><p><strong>Invite Link controls the experience.</strong><span>Spacing, animation and responsive behavior remain perfectly composed.</span></p></div>
              </>}

              {step === 4 && <>
                <ScreenHeading number="05" title="Review before your guests do" note="Use the live phone preview and confirm every detail." />
                <div className={styles.reviewList}>
                  <ReviewRow icon={<CalendarDays />} label="When" value={new Date(draft.eventDate).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })} onEdit={() => setStep(0)} />
                  <ReviewRow icon={<MapPin />} label="Where" value={`${draft.venueName}, ${draft.venueAddress}`} onEdit={() => setStep(1)} />
                  <ReviewRow icon={<MessageCircle />} label="Message" value={draft.message || "No message added"} onEdit={() => setStep(2)} />
                  <ReviewRow icon={<Palette />} label="Look" value={`${fontChoice} · ${draft.primaryColor}`} onEdit={() => setStep(3)} />
                </div>
                <a href={`/u/${templateId}`} target="_blank" rel="noreferrer" className={styles.fullPreview}><ExternalLink size={17} /> Open a full-screen template preview</a>
              </>}

              {step === 5 && <>
                <ScreenHeading number="06" title="Choose how you publish" note="One invitation. One payment. No subscription." />
                <div className={styles.plans}>
                  <button type="button" onClick={() => { update("tier", "FREE"); trackEvent("plan_selected", { template_id: templateId, plan: "FREE" }); }} className={draft.tier === "FREE" ? styles.selectedPlan : ""}>
                    <span>Free</span><strong>₹0</strong><p>Complete interactive invite<br />Elegant Invite Link opening and end screen</p><em>{draft.tier === "FREE" ? <><Check size={15} /> Selected</> : "Choose free"}</em>
                  </button>
                  <button type="button" onClick={() => { update("tier", "PREMIUM"); trackEvent("plan_selected", { template_id: templateId, plan: "PREMIUM", value: 299, currency: "INR" }); }} className={draft.tier === "PREMIUM" ? styles.selectedPlan : ""}>
                    <span><Crown size={15} /> Premium</span><strong>₹299</strong><p>No Invite Link promotion<br />Premium template and custom slug</p><em>{draft.tier === "PREMIUM" ? <><Check size={15} /> Selected</> : "Choose premium"}</em>
                  </button>
                </div>
                <div className={styles.promotionExplainer}>
                  <div><span>Free · opening</span><strong>Made with Invite Link</strong><p>A short branded welcome appears before the invitation opens.</p></div>
                  <div><span>Free · closing</span><strong>Loved this invitation?</strong><p>A refined create-yours prompt appears after the guest experience.</p></div>
                  <div><span>Premium</span><strong>Your story only</strong><p>Both Invite Link promotional moments are removed.</p></div>
                </div>
                {draft.tier === "PREMIUM" && <div className={styles.paymentNote}><Sparkles size={18} /><p><strong>Secure one-time payment</strong><span>Razorpay checkout is prepared and activates when live keys are connected.</span></p></div>}
              </>}

              {step === 6 && <>
                <ScreenHeading number="07" title={published ? "Your invitation is ready" : "Choose your link"} note={published ? "Copy it or send it directly on WhatsApp." : "Keep the slug short, personal and easy to remember."} />
                {!published ? <>
                  <label className={styles.slugField}><span>invitelink.in/</span><input value={draft.slug} onChange={(event) => update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} aria-label="Invitation link slug" /></label>
                  <div className={styles.publishSummary}><Link2 size={19} /><p><strong>{draft.eventTitle}</strong><span>{draft.tier === "PREMIUM" ? "Premium invitation" : "Free invitation with Invite Link promotion"}</span></p></div>
                  {draft.tier === "PREMIUM" && <div className={styles.checkout}><span>One-time payment</span><strong>₹299</strong><p>UPI, cards and net banking through Razorpay</p><button type="button" onClick={() => toast.success("Demo payment approved")}>Pay securely</button></div>}
                  <button type="button" className={styles.publishButton} onClick={publish}><Send size={18} /> {draft.tier === "PREMIUM" ? "Pay & publish" : "Publish invitation"}</button>
                </> : <div className={styles.published}>
                  <div className={styles.successMark}><Check size={32} /></div>
                  <span>Your live link</span><strong>{shareUrl}</strong>
                  <div><button type="button" onClick={copyLink}><Clipboard size={17} /> Copy link</button><a href={`https://wa.me/?text=${encodeURIComponent(`You're invited! ${shareUrl}`)}`} target="_blank" rel="noreferrer" onClick={() => trackEvent("share", { method: "WhatsApp", content_type: "invitation", item_id: draft.slug })}><MessageCircle size={17} /> Share on WhatsApp</a></div>
                  <Link href="/dashboard">Go to My Invitations <ArrowRight size={17} /></Link>
                </div>}
              </>}
            </motion.section>
          </AnimatePresence>
        </div>

        <div className={styles.navigation}>
          <button type="button" onClick={back} disabled={step === 0}><ArrowLeft size={17} /> Back</button>
          {step < steps.length - 1 && <button type="button" onClick={next}>Continue <ArrowRight size={17} /></button>}
        </div>
      </aside>

      <aside className={styles.previewPane} aria-label="Live invitation preview">
        <div className={styles.previewHeading}><div><span className={styles.liveDot} /> Live preview</div><span>Changes appear instantly</span></div>
        <div className={styles.phone}>
          <span className={styles.notch} />
          <InvitationExperience data={draft} TemplateComponent={TemplateComponent} mode="PREVIEW" />
        </div>
        <p><Play size={14} fill="currentColor" /> Interact with this preview exactly like a guest.</p>
      </aside>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={finalizePublish} redirectTo={`/editor/${templateId}`} />
    </div>
  );
}

function ScreenHeading({ number, title, note }: { number: string; title: string; note: string }) {
  return <div className={styles.screenHeading}><span>Step {number}</span><h1>{title}</h1><p>{note}</p></div>;
}

function Field({ label, value, onChange, placeholder, type = "text", hint, multiline = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; hint?: string; multiline?: boolean }) {
  return <label className={styles.field}><span>{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}{hint && <small>{hint}</small>}</label>;
}

function ReviewRow({ icon, label, value, onEdit }: { icon: React.ReactNode; label: string; value: string; onEdit: () => void }) {
  return <div className={styles.reviewRow}><i>{icon}</i><p><span>{label}</span><strong>{value}</strong></p><button type="button" onClick={onEdit}>Edit</button></div>;
}
