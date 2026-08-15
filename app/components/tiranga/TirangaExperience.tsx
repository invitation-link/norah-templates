"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronUp, Download, MessageCircle, Music2, Volume2, VolumeX } from "lucide-react";
import { FormEvent, KeyboardEvent as ReactKeyboardEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";
import { TirangaCommunity, TirangaStage } from "@/app/lib/tiranga";
import styles from "./TirangaExperience.module.css";

const FlagScene = dynamic(() => import("./FlagScene"), { ssr: false });

type TirangaExperienceProps = {
  incomingName?: string;
  shareId?: string;
  community?: TirangaCommunity;
};

type RopeAudio = { context: AudioContext; rope: OscillatorNode; gain: GainNode };

function AshokaChakra({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2">{Array.from({ length: 24 }, (_, index) => <line key={index} x1="50" y1="45.5" x2="50" y2="18" transform={`rotate(${index * 15} 50 50)`} />)}</g>
    </svg>
  );
}

function drawFlag(context: CanvasRenderingContext2D, x: number, y: number, width: number) {
  const height = width * 2 / 3;
  const stripe = height / 3;
  context.fillStyle = "#FF671F"; context.fillRect(x, y, width, stripe);
  context.fillStyle = "#FFFFFF"; context.fillRect(x, y + stripe, width, stripe);
  context.fillStyle = "#046A38"; context.fillRect(x, y + stripe * 2, width, stripe);
  const cx = x + width / 2;
  const cy = y + height / 2;
  const radius = stripe * 0.375;
  context.strokeStyle = "#06038D";
  context.lineWidth = Math.max(3, width / 150);
  context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.stroke();
  for (let index = 0; index < 24; index += 1) {
    const angle = Math.PI * 2 * index / 24;
    context.beginPath();
    context.moveTo(cx + Math.cos(angle) * radius * 0.16, cy + Math.sin(angle) * radius * 0.16);
    context.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    context.stroke();
  }
}

function currentDateLabel() {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date());
}

async function loadShareCardFonts() {
  const root = getComputedStyle(document.documentElement);
  const inter = root.getPropertyValue("--font-inter").trim() || "sans-serif";
  const playfair = root.getPropertyValue("--font-playfair").trim() || "serif";
  await Promise.all([document.fonts.load(`700 58px ${inter}`), document.fonts.load(`600 32px ${inter}`), document.fonts.load(`700 104px ${playfair}`)]).catch(() => undefined);
  return { inter, playfair };
}

async function makeShareCard(name: string, dedication: string, url: string) {
  const fonts = await loadShareCardFonts();
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  const gradient = context.createLinearGradient(0, 0, 0, 1920);
  gradient.addColorStop(0, "#020b1c"); gradient.addColorStop(0.58, "#143c5b"); gradient.addColorStop(1, "#b86a43");
  context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1920);
  const glow = context.createRadialGradient(780, 1190, 20, 780, 1190, 570);
  glow.addColorStop(0, "rgba(255,238,194,.86)"); glow.addColorStop(1, "rgba(255,157,76,0)");
  context.fillStyle = glow; context.fillRect(0, 0, 1080, 1920);
  drawFlag(context, 130, 240, 820);
  context.textAlign = "center";
  context.fillStyle = "rgba(255,255,255,.8)"; context.font = `700 34px ${fonts.inter}`; context.fillText("I HOISTED THE", 540, 1030);
  context.fillStyle = "#FFFFFF"; context.font = `700 104px ${fonts.playfair}`; context.fillText("TIRANGA", 540, 1150);
  context.fillStyle = "#F2CC69"; context.font = `700 58px ${fonts.inter}`; context.fillText(name.toUpperCase(), 540, 1270);
  context.fillStyle = "rgba(255,255,255,.9)"; context.font = `400 31px ${fonts.inter}`; context.fillText(currentDateLabel().toUpperCase(), 540, 1338);
  if (dedication) { context.font = `600 32px ${fonts.inter}`; context.fillText(`FOR ${dedication.toUpperCase()}`, 540, 1420, 860); }
  context.fillStyle = "rgba(255,255,255,.78)"; context.font = `600 25px ${fonts.inter}`; context.fillText(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), 540, 1810, 930);
  context.font = `600 23px ${fonts.inter}`; context.fillText("Made with Invite Link", 540, 1860);
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Card generation failed")), "image/png"));
}

function anthemCaption(progress: number) {
  if (progress < 0.2) return "Jana gana mana adhinayaka jaya he";
  if (progress < 0.48) return "From every river, mountain and shore";
  if (progress < 0.76) return "May courage and hope rise together";
  return "One anthem. One shared promise.";
}

export default function TirangaExperience({ incomingName, shareId, community }: TirangaExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<TirangaStage>("ready");
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState(0.01);
  const [enableWebgl, setEnableWebgl] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [anthemStarted, setAnthemStarted] = useState(false);
  const [anthemError, setAnthemError] = useState("");
  const [anthemProgress, setAnthemProgress] = useState(0);
  const [name, setName] = useState("");
  const [dedication, setDedication] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const progressRef = useRef(0);
  const pointerRef = useRef<number | null>(null);
  const dragStartRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const ropeAudioRef = useRef<RopeAudio | null>(null);
  const anthemAudioRef = useRef<HTMLAudioElement | null>(null);
  const milestonesRef = useRef(new Set<number>());
  const webglReadyHandler = useCallback(() => setWebglReady(true), []);

  const moveTo = useCallback((next: TirangaStage, eventName?: string) => {
    setStage(next);
    if (eventName) trackEvent(eventName, { campaign: "pass_the_tiranga", variant: "rope_first", community: community?.slug });
  }, [community?.slug]);

  useEffect(() => {
    trackEvent("tiranga_open", { campaign: "pass_the_tiranga", variant: "rope_first", referral: Boolean(shareId), community: community?.slug });
    const timer = window.setTimeout(() => setMuted(sessionStorage.getItem("tiranga-muted") === "true"), 0);
    return () => window.clearTimeout(timer);
  }, [community?.slug, shareId]);

  useEffect(() => {
    const browser = window as typeof window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const fallbackTimer = window.setTimeout(() => setEnableWebgl(true), 900);
    const idleHandle = browser.requestIdleCallback?.(() => {
      window.clearTimeout(fallbackTimer);
      setEnableWebgl(true);
    }, { timeout: 1200 });
    return () => {
      window.clearTimeout(fallbackTimer);
      if (idleHandle !== undefined) browser.cancelIdleCallback?.(idleHandle);
    };
  }, []);

  useEffect(() => {
    if (stage !== "pride") return;
    const timer = window.setTimeout(() => moveTo("anthem", "anthem_viewed"), reduceMotion ? 1600 : 3000);
    return () => window.clearTimeout(timer);
  }, [moveTo, reduceMotion, stage]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    if (ropeAudioRef.current) { ropeAudioRef.current.rope.stop(); void ropeAudioRef.current.context.close(); }
  }, []);

  const ensureRopeAudio = () => {
    if (muted) return;
    if (ropeAudioRef.current) { if (ropeAudioRef.current.context.state === "suspended") void ropeAudioRef.current.context.resume(); return; }
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = new AudioContextConstructor();
    const rope = context.createOscillator();
    const gain = context.createGain();
    rope.type = "triangle"; rope.frequency.value = 72; gain.gain.value = 0.0001;
    rope.connect(gain); gain.connect(context.destination); rope.start();
    ropeAudioRef.current = { context, rope, gain };
    if (context.state === "suspended") void context.resume();
  };

  const setRopeVolume = (velocity: number) => {
    const audio = ropeAudioRef.current;
    if (!audio || muted) return;
    const now = audio.context.currentTime;
    audio.gain.gain.cancelScheduledValues(now);
    audio.gain.gain.linearRampToValueAtTime(Math.min(0.015, 0.002 + velocity * 0.00007), now + 0.05);
    audio.rope.frequency.linearRampToValueAtTime(66 + Math.min(50, velocity * 0.2), now + 0.05);
  };

  const quietRope = useCallback(() => { const audio = ropeAudioRef.current; if (audio) audio.gain.gain.linearRampToValueAtTime(0.0001, audio.context.currentTime + 0.14); }, []);

  const updateProgress = useCallback((value: number) => {
    const next = Math.max(progressRef.current, Math.min(1, value));
    progressRef.current = next;
    setProgress(next);
    if (next > 0.01 && stage === "ready") setStage("hoisting");
    [25, 50, 75].forEach((milestone) => {
      if (next * 100 >= milestone && !milestonesRef.current.has(milestone)) {
        milestonesRef.current.add(milestone);
        navigator.vibrate?.(7);
        trackEvent(`hoist_${milestone}`, { campaign: "pass_the_tiranga" });
      }
    });
  }, [stage]);

  const finishAnthem = useCallback(() => { setAnthemProgress(1); moveTo("personalization", "anthem_completed"); }, [moveTo]);

  const playAnthem = useCallback(async () => {
    const audio = anthemAudioRef.current;
    if (!audio) return;
    try {
      setAnthemError(""); setMuted(false); sessionStorage.setItem("tiranga-muted", "false");
      audio.currentTime = 0; audio.volume = 1; await audio.play();
      setAnthemStarted(true); trackEvent("anthem_started", { campaign: "pass_the_tiranga" });
    } catch { setAnthemError("Sound could not start. Tap once more to try again."); }
  }, []);

  const skipAnthem = () => {
    const audio = anthemAudioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    trackEvent("anthem_skipped", { campaign: "pass_the_tiranga" });
    moveTo("personalization", "personalization_started");
  };

  const finishHoist = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    updateProgress(1); quietRope(); navigator.vibrate?.([18, 35, 40]);
    trackEvent("hoist_completed", { campaign: "pass_the_tiranga" });
    moveTo("unfurling");
    const from = reveal;
    const startedAt = performance.now();
    const duration = reduceMotion ? 320 : 760;
    const unfurl = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setReveal(from + (1 - from) * eased);
      if (elapsed < 1) animationRef.current = requestAnimationFrame(unfurl);
      else { animationRef.current = null; moveTo("pride", "flag_unfurled"); }
    };
    animationRef.current = requestAnimationFrame(unfurl);
  }, [moveTo, quietRope, reduceMotion, reveal, updateProgress]);

  const startGesture = (event: PointerEvent<HTMLElement>) => {
    if (stage !== "ready" && stage !== "hoisting") return;
    ensureRopeAudio();
    pointerRef.current = event.pointerId;
    dragStartRef.current = event.clientY + progressRef.current * Math.min(window.innerHeight * 0.58, 520);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (stage === "ready") trackEvent("hoist_started", { campaign: "pass_the_tiranga", input: "swipe" });
  };

  const moveGesture = (event: PointerEvent<HTMLElement>) => {
    if (pointerRef.current !== event.pointerId) return;
    const distance = Math.min(window.innerHeight * 0.58, 520);
    const previous = progressRef.current;
    const raw = (dragStartRef.current - event.clientY) / distance;
    const resisted = raw <= 0.88 ? raw : 0.88 + (raw - 0.88) * 0.46;
    updateProgress(Math.max(previous, resisted));
    setRopeVolume(Math.abs(resisted - previous) * distance * 60);
  };

  const releaseGesture = (event: PointerEvent<HTMLElement>) => {
    if (pointerRef.current !== event.pointerId) return;
    pointerRef.current = null; quietRope();
    if (progressRef.current >= 0.94) finishHoist();
  };

  const accessibleHoist = () => {
    ensureRopeAudio();
    if (progressRef.current === 0) trackEvent("hoist_started", { campaign: "pass_the_tiranga", input: "button" });
    const next = Math.min(1, progressRef.current + 0.17);
    updateProgress(next); setRopeVolume(80); window.setTimeout(quietRope, 90);
    if (next >= 0.94) finishHoist();
  };

  const keyboardHoist = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowUp") { event.preventDefault(); accessibleHoist(); }
    if ((event.key === "Enter" || event.key === " ") && progressRef.current < 0.94) { event.preventDefault(); updateProgress(1); finishHoist(); }
  };

  const createShare = async (cleanName: string, cleanDedication: string) => {
    try {
      const response = await fetch("/api/tiranga/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: cleanName, dedication: cleanDedication || undefined, parentShareId: shareId, community: community?.slug }) });
      if (response.ok) { const result = await response.json(); setShareUrl(result.url); return; }
    } catch { /* The canonical route remains shareable during a temporary API outage. */ }
    setShareUrl(`${window.location.origin}/tiranga`);
  };

  const submitPersonalization = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanDedication = dedication.trim();
    if (!cleanName || submitting) return;
    setSubmitting(true);
    const participation = fetch("/api/tiranga/participate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: cleanName, dedication: cleanDedication || undefined, referredBy: shareId, community: community?.slug }) }).catch(() => undefined);
    try {
      await Promise.all([participation, createShare(cleanName, cleanDedication)]);
      moveTo("share", "personalization_completed");
    } finally {
      setSubmitting(false);
    }
  };

  const shareText = () => `${name.trim()} hoisted the Tiranga${dedication.trim() ? ` for ${dedication.trim()}` : ""}. A Tiranga is waiting for you.`;

  const shareWhatsApp = () => {
    const url = shareUrl || `${window.location.origin}/tiranga`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText()}\n${url}`)}`, "_blank", "noopener,noreferrer");
    trackEvent("share_whatsapp", { campaign: "pass_the_tiranga" });
  };

  const downloadStory = async () => {
    if (downloading) return;
    setDownloading(true);
    setShareStatus("");
    const url = shareUrl || `${window.location.origin}/tiranga`;
    try {
      const blob = await makeShareCard(name.trim(), dedication.trim(), url);
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl; anchor.download = "pass-the-tiranga-story.png"; anchor.click();
      URL.revokeObjectURL(downloadUrl);
      setShareStatus("Story card saved");
      trackEvent("share_card_downloaded", { campaign: "pass_the_tiranga" });
    } catch {
      setShareStatus("The card could not be saved. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next); sessionStorage.setItem("tiranga-muted", String(next));
    if (ropeAudioRef.current) ropeAudioRef.current.gain.gain.value = 0.0001;
  };

  const showSound = stage === "ready" || stage === "hoisting";
  const showPetals = stage === "pride";
  const sceneActive = stage === "ready" || stage === "hoisting" || stage === "unfurling" || stage === "pride" || stage === "anthem";
  const urlLabel = (shareUrl || "invite-link-rosy.vercel.app/tiranga").replace(/^https?:\/\//, "");

  return (
    <main className={styles.shell} style={{ "--progress": progress, "--reveal": reveal } as React.CSSProperties}>
      <audio ref={anthemAudioRef} src="/audio/jana-gana-mana.mp3" preload="metadata" onTimeUpdate={(event) => { const audio = event.currentTarget; setAnthemProgress(audio.duration ? audio.currentTime / audio.duration : 0); }} onEnded={finishAnthem} />
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.horizon} aria-hidden="true" />
      {enableWebgl && <FlagScene progress={progress} reveal={reveal} active={sceneActive} reducedMotion={Boolean(reduceMotion)} onReady={webglReadyHandler} />}
      <div className={`${styles.fallbackFlag} ${reveal <= 0.12 ? styles.bundledFlag : ""} ${webglReady ? styles.webglLoaded : ""}`} style={{ transform: `translateY(${(1 - progress) * 68}dvh)` }} aria-hidden="true"><i className={styles.fallbackRope} /><span /><span><AshokaChakra className={styles.flagChakra} /></span><span /></div>
      {showPetals && <div className={styles.petals} aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ "--petal-x": `${18 + (index * 31) % 66}%`, "--petal-delay": `${(index % 4) * 0.035}s`, "--petal-drift": `${(index % 2 ? 1 : -1) * (32 + (index % 6) * 11)}px` } as React.CSSProperties} />)}</div>}
      {showSound && <button type="button" className={styles.soundToggle} onClick={toggleSound} aria-label={muted ? "Turn ceremonial sound on" : "Mute ceremonial sound"}>{muted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>}

      <AnimatePresence mode="wait" initial={false}>
        {(stage === "ready" || stage === "hoisting") && <motion.section key="gesture" className={styles.gesture} tabIndex={0} onKeyDown={keyboardHoist} onPointerDown={startGesture} onPointerMove={moveGesture} onPointerUp={releaseGesture} onPointerCancel={releaseGesture} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Raise the Tiranga. Swipe upward, press Arrow Up repeatedly, or use the hoist button.">
          <div className={styles.srOnly} role="progressbar" aria-label="Tiranga hoisting progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>The flag is rising.</div>
          <div className={styles.swipeCue}><span><ChevronUp size={28} /></span><strong>{progress > 0 ? "Keep lifting" : "Swipe up to hoist"}</strong></div>
          <button className={styles.accessibleHoist} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={accessibleHoist}>Hoist without swiping</button>
        </motion.section>}

        {stage === "pride" && <motion.section key="pride-pause" className={styles.pridePause} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="The Tiranga is flying" />}

        {stage === "anthem" && <motion.section key="anthem" className={styles.anthem} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div>
          <span>National Anthem</span><h1>Jana Gana Mana</h1>
          {!anthemStarted ? <><p>Please stand, if you are able.</p><button type="button" onClick={() => void playAnthem()}><Music2 size={19} /> Play the anthem</button></> : <><p className={styles.anthemCaption} aria-live="polite">{anthemCaption(anthemProgress)}</p><div className={styles.anthemProgress} role="progressbar" aria-label="National Anthem playback" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(anthemProgress * 100)}><i style={{ width: `${anthemProgress * 100}%` }} /></div></>}
          {anthemError && <p className={styles.error} role="alert">{anthemError}</p>}
          <button type="button" className={styles.anthemSkip} onClick={skipAnthem}>{anthemStarted ? "Continue quietly" : "Continue without anthem"}</button>
        </div></motion.section>}

        {stage === "personalization" && <motion.section key="personalization" className={styles.sheet} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <span className={styles.eyebrow}>Make it yours</span><h2>Who raised it?</h2>
          <form onSubmit={submitPersonalization}>
            <label>First name<input value={name} onFocus={(event) => event.currentTarget.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" })} onChange={(event) => setName(event.target.value)} maxLength={28} autoComplete="given-name" enterKeyHint="next" required /></label>
            <label>Who are you hoisting this for? <small>Optional</small><input value={dedication} onFocus={(event) => event.currentTarget.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" })} onChange={(event) => setDedication(event.target.value)} maxLength={48} autoComplete="off" enterKeyHint="done" /></label>
            <button type="submit" disabled={submitting}>{submitting ? "Preparing your Tiranga…" : "Create my story card"} {!submitting && <ArrowRight size={18} />}</button>
          </form>
        </motion.section>}

        {stage === "share" && <motion.section key="share" className={`${styles.sheet} ${styles.shareSheet}`} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <div className={styles.chain} aria-label={`${incomingName || "You"} passed the Tiranga to ${name.trim()}; ${name.trim()} can pass it forward`}>
            <div><span>{incomingName ? "From" : "Started by"}</span><strong>{incomingName || name.trim()}</strong></div><ArrowRight size={17} />
            {incomingName && <><div><span>Now</span><strong>{name.trim()}</strong></div><ArrowRight size={17} /></>}
            <div><span>Next</span><strong>Who&apos;s next?</strong></div>
          </div>
          <div className={styles.shareCard} aria-label={`Tiranga story card for ${name.trim()}`}><div className={styles.miniFlag}><span /><span><AshokaChakra /></span><span /></div><small>I hoisted the</small><h3>Tiranga</h3><strong>{name.trim()}</strong>{dedication.trim() && <p>For {dedication.trim()}</p>}<span>{currentDateLabel()}</span><small className={styles.cardUrl}>{urlLabel}</small><footer>Made with Invite Link</footer></div>
          <button type="button" className={styles.whatsappButton} onClick={shareWhatsApp}><MessageCircle size={19} /> Pass on WhatsApp</button>
          <button type="button" className={styles.downloadButton} disabled={downloading} onClick={() => void downloadStory()}><Download size={18} /> {downloading ? "Preparing story card…" : "Save story card"}</button>
          {shareStatus && <p className={styles.status} role="status">{shareStatus}</p>}
          <button type="button" className={styles.textButton} onClick={() => moveTo("conversion", "invite_link_cta_viewed")}>Done</button>
        </motion.section>}

        {stage === "conversion" && <motion.section key="conversion" className={styles.conversion} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Link href="/create" onClick={() => trackEvent("invite_link_cta_clicked", { campaign: "pass_the_tiranga" })}>Create a moment worth opening — Invite Link <ArrowRight size={17} /></Link></motion.section>}
      </AnimatePresence>
    </main>
  );
}
