"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  ExternalLink,
  Heart,
  MapPin,
  MessageCircle,
  MousePointer2,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Home.module.css";
import { trackEvent } from "./lib/analytics";

type Template = {
  id: string;
  name: string;
  category: "Birthday" | "Wedding" | "Housewarming" | "Celebration";
  feeling: string;
  interaction: string;
  image: string;
  demoUrl: string;
  tone: "light" | "dark";
};

const templates: Template[] = [
  {
    id: "digital-tiranga",
    name: "Digital Tiranga",
    category: "Celebration",
    feeling: "Proud, human, purposeful",
    interaction: "Hold to raise the Tiranga",
    image: "/images/templates/live/digital-tiranga-hero.png",
    demoUrl: "/tiranga",
    tone: "dark",
  },
  {
    id: "new-door",
    name: "The New Door",
    category: "Housewarming",
    feeling: "Warm, cinematic, intimate",
    interaction: "Tap to open the door",
    image: "/images/templates/live/norah-housewarming.png",
    demoUrl: "https://norah-housewarming.vercel.app/",
    tone: "dark",
  },
  {
    id: "underwater-one",
    name: "Underwater One",
    category: "Birthday",
    feeling: "Magical, playful, wonder-filled",
    interaction: "Dive into the celebration",
    image: "/images/templates/live/underwater-one.png",
    demoUrl: "https://invite-platform-six.vercel.app/rudhrakshi",
    tone: "light",
  },
  {
    id: "golden-unboxing",
    name: "Golden Unboxing",
    category: "Birthday",
    feeling: "Joyful, bright, surprising",
    interaction: "Tap the gift to reveal",
    image: "/images/templates/live/ganishka-original.png",
    demoUrl: "/u/ganishka-original",
    tone: "light",
  },
  {
    id: "royal-vows",
    name: "Royal Vows",
    category: "Wedding",
    feeling: "Grand, romantic, timeless",
    interaction: "Enter through palace doors",
    image: "/images/templates/live/royal-wedding.png",
    demoUrl: "/u/royal-wedding",
    tone: "dark",
  },
  {
    id: "after-dark",
    name: "After Dark",
    category: "Celebration",
    feeling: "Electric, social, energetic",
    interaction: "Scratch to reveal the plan",
    image: "/images/templates/live/casual-party.png",
    demoUrl: "/u/casual-party",
    tone: "dark",
  },
  {
    id: "the-summit",
    name: "The Summit",
    category: "Celebration",
    feeling: "Focused, modern, confident",
    interaction: "Reveal the event agenda",
    image: "/images/templates/live/corporate-summit.png",
    demoUrl: "/u/corporate-summit",
    tone: "dark",
  },
];

const categories = ["All", "Birthday", "Wedding", "Housewarming", "Celebration"] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={styles.brand} aria-label="Invite Link">
      <Image
        src="/brand/invite-link-mark.png"
        alt=""
        width={510}
        height={445}
        priority
        className={styles.brandMark}
      />
      <span className={styles.brandWords}>
        <span>invite</span> <strong>Link</strong>
        {!compact && <small>One link. Every connection.</small>}
      </span>
    </span>
  );
}

function LivePreview({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <motion.div
      className={styles.previewBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} live preview`}
      onClick={onClose}
    >
      <motion.div
        className={styles.previewShell}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.previewBar}>
          <div>
            <span>{template.category}</span>
            <strong>{template.name}</strong>
          </div>
          <div className={styles.previewActions}>
            <a href={template.demoUrl} target="_blank" rel="noreferrer">
              Full screen <ExternalLink size={15} aria-hidden="true" />
            </a>
            <button type="button" onClick={onClose} aria-label="Close live preview">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={styles.previewCanvas}>
          <div className={styles.deviceFrame}>
            <span className={styles.deviceSpeaker} aria-hidden="true" />
            <iframe src={template.demoUrl} title={`${template.name} interactive invitation`} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [preview, setPreview] = useState<Template | null>(null);
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroVisualY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 72]);
  const heroVisualScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.96]);

  const visibleTemplates = useMemo(
    () => (category === "All" ? templates : templates.filter((template) => template.category === category)),
    [category],
  );

  const openPreview = (template: Template, placement: string) => {
    trackEvent("template_preview_open", { template_id: template.id, template_category: template.category, placement });
    setPreview(template);
  };

  useEffect(() => {
    if (!preview) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [preview]);

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brandLink} aria-label="Invite Link home">
          <Brand compact />
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#templates">Templates</a>
          <a href="#how-it-works">How it works</a>
          <Link href="/about">Our story</Link>
        </nav>
        <Link href="/create" className={styles.headerCta}>
          Create an invite <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </header>

      <section className={styles.hero} ref={heroRef} id="main-content">
        <div className={styles.heroGlow} aria-hidden="true" />
        <motion.div
          className={styles.heroCopy}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.08 }}
        >
          <motion.div variants={reveal} transition={{ duration: 0.45 }} className={styles.eyebrow}>
            <Sparkles size={16} aria-hidden="true" />
            Invitations that begin with a feeling
          </motion.div>
          <motion.h1 variants={reveal} transition={{ duration: 0.55 }}>
            Don&apos;t just send an invitation.
            <em>Make them feel invited.</em>
          </motion.h1>
          <motion.p variants={reveal} transition={{ duration: 0.55 }} className={styles.heroLead}>
            Choose a beautifully choreographed experience, personalize the details, and share one unforgettable link.
          </motion.p>
          <motion.div variants={reveal} transition={{ duration: 0.55 }} className={styles.heroActions}>
            <Link href="/create" className={styles.primaryButton} onClick={() => trackEvent("create_started", { placement: "hero" })}>
              Create your invite <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <a href="#templates" className={styles.secondaryButton}>
              <Play size={17} fill="currentColor" aria-hidden="true" />
              Explore live designs
            </a>
          </motion.div>
          <motion.p variants={reveal} className={styles.heroNote}>
            No design skills needed. Preview before you publish.
          </motion.p>
        </motion.div>

        <motion.div className={styles.heroVisual} style={{ y: heroVisualY, scale: heroVisualScale }}>
          <div className={styles.posterHalo} aria-hidden="true" />
          <motion.div
            className={styles.heroPoster}
            initial={{ opacity: 0, rotate: 2, y: 24 }}
            animate={{ opacity: 1, rotate: -1.5, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/templates/live/norah-housewarming.png"
              alt="The actual opening screen of The New Door housewarming invitation"
              fill
              sizes="(max-width: 900px) 82vw, 42vw"
              priority
              className={styles.posterImage}
            />
            <button type="button" className={styles.posterPlay} onClick={() => openPreview(templates[0], "hero_poster")}>
              <span><Play size={18} fill="currentColor" aria-hidden="true" /></span>
              Watch it open
            </button>
          </motion.div>
          <motion.div
            className={styles.floatingInvite}
            initial={{ opacity: 0, x: 20, y: 18 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.55, delay: 0.65 }}
          >
            <Heart size={18} aria-hidden="true" />
            <div><strong>Feels personal</strong><span>Because it moves with the moment</span></div>
          </motion.div>
          <motion.div
            className={styles.floatingRsvp}
            initial={{ opacity: 0, x: -16, y: 18 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.55, delay: 0.78 }}
          >
            <MessageCircle size={17} aria-hidden="true" /> RSVP on WhatsApp
          </motion.div>
        </motion.div>
      </section>

      <section className={styles.occasionStrip} aria-label="Available occasions">
        <span>Made for life&apos;s best moments</span>
        <div>
          <Link href="/occasions/birthday">Birthday</Link><i aria-hidden="true" />
          <Link href="/occasions/wedding">Wedding</Link><i aria-hidden="true" />
          <Link href="/occasions/housewarming">Housewarming</Link><i aria-hidden="true" />
          <Link href="/occasions/celebrations">Celebrations</Link>
        </div>
      </section>

      <section className={styles.templatesSection} id="templates">
        <div className={styles.sectionIntro}>
          <div>
            <span className={styles.kicker}>Live invitation experiences</span>
            <h2>Choose the feeling first.</h2>
          </div>
          <p>Every template has its own opening moment, story, details, and RSVP flow. You only change what matters.</p>
        </div>

        <div className={styles.filters} role="group" aria-label="Filter invitation templates">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? styles.filterActive : ""}
              onClick={() => { setCategory(item); trackEvent("template_filter", { category: item }); }}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <motion.div layout className={styles.templateGrid}>
          <AnimatePresence mode="popLayout">
            {visibleTemplates.map((template, index) => (
              <motion.article
                layout
                key={template.id}
                className={styles.templateTile}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : index * 0.035 }}
              >
                <button
                  type="button"
                  className={styles.templateMedia}
                  onClick={() => openPreview(template, "gallery_image")}
                  aria-label={`Preview ${template.name}`}
                >
                  <Image
                    src={template.image}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    className={styles.templateImage}
                  />
                  <span className={styles.mediaShade} aria-hidden="true" />
                  <span className={styles.liveBadge}><i /> Live demo</span>
                  <span className={styles.previewButton}><Play size={18} fill="currentColor" aria-hidden="true" /> Preview</span>
                  <span className={styles.interactionLabel}><MousePointer2 size={15} aria-hidden="true" /> {template.interaction}</span>
                </button>
                <div className={styles.templateMeta}>
                  <div>
                    <span>{template.category}</span>
                    <h3>{template.name}</h3>
                    <p>{template.feeling}</p>
                  </div>
                  <button type="button" onClick={() => openPreview(template, "gallery_details")} aria-label={`Open ${template.name} live demo`}>
                    <ChevronRight size={21} aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className={styles.principleSection}>
        <motion.div
          className={styles.principleMark}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <Image src="/brand/invite-link-mark.png" alt="Invite Link symbol" width={510} height={445} />
        </motion.div>
        <motion.div
          className={styles.principleCopy}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <span className={styles.kicker}>Our product principle</span>
          <h2>You shape the words.<br />We choreograph the feeling.</h2>
          <p>No drag-and-drop chaos. Every detail you edit stays inside a carefully designed experience.</p>
          <div className={styles.principleChecks}>
            <span><Check size={17} aria-hidden="true" /> Your names and story</span>
            <span><Check size={17} aria-hidden="true" /> Your date and place</span>
            <span><Check size={17} aria-hidden="true" /> Your photos and music</span>
          </div>
        </motion.div>
      </section>

      <section className={styles.journeySection} id="how-it-works">
        <div className={styles.sectionIntro}>
          <div>
            <span className={styles.kicker}>Three simple steps</span>
            <h2>From occasion to shared link.</h2>
          </div>
          <p>Explore freely. Sign in only when you are ready to publish.</p>
        </div>
        <div className={styles.journeyLine}>
          <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
            <span>01</span><Sparkles aria-hidden="true" />
            <h3>Choose</h3><p>Pick an occasion and preview the experience as your guest will see it.</p>
          </motion.article>
          <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} transition={{ delay: 0.08 }}>
            <span>02</span><CalendarDays aria-hidden="true" />
            <h3>Personalize</h3><p>Add your names, date, venue, photos, message, and preferred theme.</p>
          </motion.article>
          <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} transition={{ delay: 0.16 }}>
            <span>03</span><MessageCircle aria-hidden="true" />
            <h3>Share</h3><p>Publish one link and send it straight to everyone on WhatsApp.</p>
          </motion.article>
        </div>
      </section>

      <section className={styles.shareMoment}>
        <div className={styles.sharePhone} aria-hidden="true">
          <div className={styles.shareTop}><span /> Invite Link</div>
          <div className={styles.chatBubble}>We&apos;d love you to be there.</div>
          <div className={styles.linkBubble}>
            <div className={styles.linkPreview}><Image src="/brand/invite-link-mark.png" alt="" width={510} height={445} /></div>
            <strong>Aarav turns one</strong>
            <span>invitelink.in/aarav</span>
          </div>
        </div>
        <div className={styles.shareCopy}>
          <span className={styles.kicker}>Built to travel</span>
          <h2>One link.<br />Every connection.</h2>
          <p>Your invitation opens beautifully in the browser—no app download, no attachment, no friction.</p>
          <div><MapPin size={18} aria-hidden="true" /> Directions <i /> <Heart size={18} aria-hidden="true" /> RSVP <i /> <CalendarDays size={18} aria-hidden="true" /> Add to calendar</div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <Image src="/brand/invite-link-lockup.png" alt="Invite Link — One link. Every connection." width={608} height={560} />
        <div>
          <span className={styles.kicker}>Your next occasion deserves more</span>
          <h2>Make the invitation part of the memory.</h2>
          <Link href="/create" className={styles.goldButton} onClick={() => trackEvent("create_started", { placement: "final_cta" })}>
            Start creating <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <Brand compact />
        <p>Beautiful interactive invitations, made to be felt.</p>
        <div><Link href="/templates">Templates</Link><Link href="/faq">FAQ</Link><Link href="/about">About</Link></div>
        <span>© 2026 Invite Link</span>
      </footer>

      <AnimatePresence>{preview && <LivePreview template={preview} onClose={() => setPreview(null)} />}</AnimatePresence>
    </main>
  );
}
