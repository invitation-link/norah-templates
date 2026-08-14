"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronUp, Copy, Download, MessageCircle, Music2, Share2, Volume2, VolumeX } from "lucide-react";
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

type RopeAudio = {
  context: AudioContext;
  rope: OscillatorNode;
  gain: GainNode;
};

function AshokaChakra({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2">
        {Array.from({ length: 24 }, (_, index) => (
          <line key={index} x1="50" y1="45.5" x2="50" y2="18" transform={`rotate(${index * 15} 50 50)`} />
        ))}
      </g>
    </svg>
  );
}

function drawFlag(context: CanvasRenderingContext2D, x: number, y: number, width: number) {
  const height = width * 2 / 3;
  const stripe = height / 3;
  context.fillStyle = "#FF671F";
  context.fillRect(x, y, width, stripe);
  context.fillStyle = "#FFFFFF";
  context.fillRect(x, y + stripe, width, stripe);
  context.fillStyle = "#046A38";
  context.fillRect(x, y + stripe * 2, width, stripe);
  const cx = x + width / 2;
  const cy = y + height / 2;
  const radius = stripe * 0.375;
  context.strokeStyle = "#06038D";
  context.lineWidth = Math.max(3, width / 150);
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.stroke();
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
  await Promise.all([
    document.fonts.load(`700 58px ${inter}`),
    document.fonts.load(`600 32px ${inter}`),
    document.fonts.load(`700 104px ${playfair}`),
  ]).catch(() => undefined);
  return { inter, playfair };
}

async function makeShareCard(name: string, city: string, participantNumber: number | null, size: "story" | "post", url: string) {
  const fonts = await loadShareCardFonts();
  const dateLabel = currentDateLabel();
  const width = 1080;
  const height = size === "story" ? 1920 : 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#071a38");
  gradient.addColorStop(0.52, "#164864");
  gradient.addColorStop(1, "#d88a4d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  const glow = context.createRadialGradient(width * 0.7, height * 0.67, 20, width * 0.7, height * 0.67, width * 0.62);
  glow.addColorStop(0, "rgba(255,232,177,.86)");
  glow.addColorStop(1, "rgba(255,167,82,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  drawFlag(context, 130, size === "story" ? 250 : 100, 820);
  context.textAlign = "center";
  context.fillStyle = "rgba(255,255,255,.78)";
  context.font = `700 34px ${fonts.inter}`;
  context.fillText("I RAISED THE", width / 2, size === "story" ? 1030 : 785);
  context.fillStyle = "#FFFFFF";
  context.font = `700 104px ${fonts.playfair}`;
  context.fillText("TIRANGA", width / 2, size === "story" ? 1150 : 900);
  context.fillStyle = "#F2CC69";
  context.font = `700 58px ${fonts.inter}`;
  context.fillText(name.toUpperCase(), width / 2, size === "story" ? 1270 : 1010);
  context.fillStyle = "rgba(255,255,255,.92)";
  context.font = `400 32px ${fonts.inter}`;
  context.fillText(`${city.toUpperCase()} · ${dateLabel.toUpperCase()}`, width / 2, size === "story" ? 1340 : 1070);
  context.font = `600 28px ${fonts.inter}`;
  context.fillText(participantNumber ? `#${participantNumber.toLocaleString("en-IN")} · PASS IT FORWARD` : "PASS IT FORWARD", width / 2, size === "story" ? 1410 : 1130);
  context.fillStyle = "rgba(255,255,255,.72)";
  context.font = `600 22px ${fonts.inter}`;
  context.fillText(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), width / 2, height - 116);
  context.font = `600 24px ${fonts.inter}`;
  context.fillText("Made with Invite Link", width / 2, height - 68);

  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Card generation failed")), "image/png"));
}

export default function TirangaExperience({ incomingName, shareId, community }: TirangaExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<TirangaStage>("intro");
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState(0.08);
  const [webglReady, setWebglReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [anthemStarted, setAnthemStarted] = useState(false);
  const [anthemError, setAnthemError] = useState("");
  const [anthemProgress, setAnthemProgress] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [participantNumber, setParticipantNumber] = useState<number | null>(null);
  const [shareRecordId, setShareRecordId] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    if (eventName) trackEvent(eventName, { campaign: "pass_the_tiranga", community: community?.slug });
  }, [community?.slug]);

  useEffect(() => {
    trackEvent("tiranga_open", { campaign: "pass_the_tiranga", referral: Boolean(shareId), community: community?.slug });
    const timer = window.setTimeout(() => setMuted(sessionStorage.getItem("tiranga-muted") === "true"), 0);
    return () => window.clearTimeout(timer);
  }, [community?.slug, shareId]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    if (ropeAudioRef.current) {
      ropeAudioRef.current.rope.stop();
      void ropeAudioRef.current.context.close();
    }
  }, []);

  const ensureRopeAudio = () => {
    if (muted) return;
    if (ropeAudioRef.current) {
      if (ropeAudioRef.current.context.state === "suspended") void ropeAudioRef.current.context.resume();
      return;
    }
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = new AudioContextConstructor();
    const rope = context.createOscillator();
    const gain = context.createGain();
    rope.type = "triangle";
    rope.frequency.value = 72;
    gain.gain.value = 0.0001;
    rope.connect(gain);
    gain.connect(context.destination);
    rope.start();
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

  const quietRope = useCallback(() => {
    const audio = ropeAudioRef.current;
    if (audio) audio.gain.gain.linearRampToValueAtTime(0.0001, audio.context.currentTime + 0.12);
  }, []);

  const updateProgress = useCallback((value: number) => {
    const next = Math.max(0, Math.min(1, value));
    progressRef.current = next;
    setProgress(next);
    [25, 50, 75].forEach((milestone) => {
      if (next >= milestone / 100 && !milestonesRef.current.has(milestone)) {
        milestonesRef.current.add(milestone);
        trackEvent(`hoist_${milestone}`, { campaign: "pass_the_tiranga" });
        if (milestone === 50 && navigator.vibrate) navigator.vibrate(8);
      }
    });
  }, []);

  const tweenProgress = useCallback((target: number, duration: number, onDone?: () => void) => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    const from = progressRef.current;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      updateProgress(from + (target - from) * eased);
      if (elapsed < 1) animationRef.current = requestAnimationFrame(tick);
      else {
        animationRef.current = null;
        onDone?.();
      }
    };
    animationRef.current = requestAnimationFrame(tick);
  }, [updateProgress]);

  const finishAnthem = useCallback(() => {
    setAnthemProgress(1);
    moveTo("pride", "anthem_completed");
  }, [moveTo]);

  const playAnthem = useCallback(async () => {
    const audio = anthemAudioRef.current;
    if (!audio) return;
    try {
      setAnthemError("");
      setMuted(false);
      sessionStorage.setItem("tiranga-muted", "false");
      audio.currentTime = 0;
      audio.volume = 1;
      await audio.play();
      setAnthemStarted(true);
      trackEvent("anthem_started", { campaign: "pass_the_tiranga" });
    } catch {
      setAnthemError("Sound could not start. Tap once more to try again.");
    }
  }, []);

  const finishHoist = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    updateProgress(1);
    quietRope();
    moveTo("unfurling");
    trackEvent("hoist_completed", { campaign: "pass_the_tiranga" });
    if (navigator.vibrate) navigator.vibrate(34);

    const from = reveal;
    const startedAt = performance.now();
    const duration = reduceMotion ? 320 : 760;
    const unfurl = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setReveal(from + (1 - from) * eased);
      if (elapsed < 1) animationRef.current = requestAnimationFrame(unfurl);
      else {
        animationRef.current = null;
        moveTo("anthem", "anthem_viewed");
      }
    };
    animationRef.current = requestAnimationFrame(unfurl);
  }, [moveTo, quietRope, reduceMotion, reveal, updateProgress]);

  const beginCeremony = () => {
    moveTo("ready", "ceremony_started");
  };

  const startGesture = (event: PointerEvent<HTMLElement>) => {
    if (completedRef.current || (stage !== "ready" && stage !== "hoisting")) return;
    ensureRopeAudio();
    pointerRef.current = event.pointerId;
    const distance = Math.min(window.innerHeight * 0.58, 520);
    dragStartRef.current = event.clientY + progressRef.current * distance;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (stage !== "hoisting") {
      moveTo("hoisting");
      trackEvent("hoist_started", { campaign: "pass_the_tiranga" });
    }
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
    pointerRef.current = null;
    quietRope();
    if (progressRef.current >= 0.93) tweenProgress(1, reduceMotion ? 100 : 360, finishHoist);
    else moveTo("ready");
  };

  const accessibleHoist = () => {
    ensureRopeAudio();
    moveTo("hoisting");
    trackEvent("hoist_started", { campaign: "pass_the_tiranga", input: "accessible_button" });
    tweenProgress(1, reduceMotion ? 120 : 900, finishHoist);
  };

  const keyboardHoist = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      accessibleHoist();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(1, progressRef.current + 0.16);
      if (next >= 0.93) tweenProgress(1, reduceMotion ? 120 : 360, finishHoist);
      else updateProgress(next);
    }
  };

  const createShare = async (cleanName: string, cleanCity: string) => {
    try {
      const response = await fetch("/api/tiranga/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, city: cleanCity, parentShareId: shareId, community: community?.slug }),
      });
      if (response.ok) {
        const result = await response.json();
        setShareRecordId(result.shareId);
        setShareUrl(result.url);
        return;
      }
    } catch {
      // The current route remains shareable if the campaign API is temporarily unavailable.
    }
    setShareUrl(`${window.location.origin}/tiranga`);
  };

  const submitPersonalization = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanCity = city.trim();
    if (!cleanName || !cleanCity || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/tiranga/participate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, city: cleanCity, referredBy: shareId, community: community?.slug }),
      });
      if (response.ok) {
        const result = await response.json();
        setParticipantId(result.participantId);
        setParticipantNumber(typeof result.participantNumber === "number" ? result.participantNumber : null);
      }
    } catch {
      // The ceremony remains usable if the campaign API is temporarily unavailable.
    }
    await createShare(cleanName, cleanCity);
    setSubmitting(false);
    moveTo("share", "personalization_completed");
  };

  const shareText = () => `${name.trim()} raised the Tiranga in ${city.trim()}. Raise yours and pass it forward.`;

  const shareWhatsApp = () => {
    const url = shareUrl || `${window.location.origin}/tiranga`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText()}\n${url}`)}`, "_blank", "noopener,noreferrer");
    trackEvent("share_whatsapp", { campaign: "pass_the_tiranga" });
  };

  const nativeShare = async () => {
    const url = shareUrl || `${window.location.origin}/tiranga`;
    try {
      const blob = await makeShareCard(name.trim(), city.trim(), participantNumber, "story", url);
      const file = new File([blob], "pass-the-tiranga.png", { type: "image/png" });
      if (navigator.share) {
        const data: ShareData = { title: "Pass the Tiranga", text: shareText(), url };
        if (navigator.canShare?.({ files: [file] })) data.files = [file];
        await navigator.share(data);
        setShareStatus("Shared");
        trackEvent("share_native", { campaign: "pass_the_tiranga" });
        return;
      }
    } catch {
      // A cancelled native share should not block the other share options.
    }
    shareWhatsApp();
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl || `${window.location.origin}/tiranga`);
    setShareStatus("Link copied");
    trackEvent("share_copy", { campaign: "pass_the_tiranga" });
  };

  const downloadCard = async (size: "story" | "post") => {
    const blob = await makeShareCard(name.trim(), city.trim(), participantNumber, size, shareUrl || `${window.location.origin}/tiranga`);
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `pass-the-tiranga-${size}.png`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    setShareStatus(size === "story" ? "Instagram story saved" : "Social post saved");
  };

  const sendToPhone = async (event: FormEvent) => {
    event.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneError("");
    void fetch("/api/tiranga/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: participantId || undefined, shareId: shareRecordId || undefined, phone: cleanPhone, deliveryConsent: true, marketingConsent }),
    }).catch(() => undefined);
    const url = shareUrl || `${window.location.origin}/tiranga`;
    window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`${shareText()}\n${url}`)}`, "_blank", "noopener,noreferrer");
    setShareStatus("Opening your Tiranga in WhatsApp");
    trackEvent("share_phone_delivery", { campaign: "pass_the_tiranga", marketing_consent: marketingConsent });
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    sessionStorage.setItem("tiranga-muted", String(next));
    if (ropeAudioRef.current) ropeAudioRef.current.gain.gain.value = 0.0001;
  };

  const dateLabel = currentDateLabel();
  const showCanvas = true;
  const showPresentation = stage !== "unfurling" && stage !== "anthem" && stage !== "pride" && stage !== "conversion";
  const showPetals = stage === "anthem" || stage === "pride";

  return (
    <main className={styles.shell} style={{ "--progress": progress, "--reveal": reveal } as React.CSSProperties}>
      <audio ref={anthemAudioRef} src="/audio/jana-gana-mana.mp3" preload="auto" onTimeUpdate={(event) => {
        const audio = event.currentTarget;
        setAnthemProgress(audio.duration ? audio.currentTime / audio.duration : 0);
      }} onEnded={finishAnthem} />
      <div className={styles.sky} aria-hidden="true" />
      {showCanvas && <FlagScene progress={progress} reveal={reveal} active reducedMotion={Boolean(reduceMotion)} onReady={webglReadyHandler} />}
      {showCanvas && <div className={`${styles.fallbackFlag} ${webglReady ? styles.webglLoaded : ""}`} style={{ transform: `translateY(${(1 - progress) * 42}vh) scaleX(${Math.max(0.08, reveal)})` }} aria-hidden="true">
        <span /><span><AshokaChakra className={styles.flagChakra} /></span><span />
      </div>}
      {showPetals && <div className={styles.petals} aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--petal-x": `${8 + (index * 29) % 86}%`, "--petal-delay": `${(index % 7) * 0.12}s`, "--petal-drift": `${(index % 2 ? 1 : -1) * (24 + (index % 5) * 8)}px`, "--petal-duration": `${2.6 + (index % 4) * 0.35}s` } as React.CSSProperties} />)}
      </div>}

      {showPresentation && <header className={styles.presentation}>
        <div><Image src="/brand/invite-link-mark.png" alt="" width={28} height={25} /><span>Invite Link presents</span></div>
        {stage !== "intro" && <button type="button" onClick={toggleSound} aria-label={muted ? "Turn ceremonial sound on" : "Mute ceremonial sound"}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>}
      </header>}

      <AnimatePresence mode="wait">
        {stage === "intro" && <motion.section key="welcome" className={styles.welcome} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -18 }}>
          <span>{incomingName ? `${incomingName} passed this to you` : community?.name || "Pass the Tiranga"}</span>
          <h1>One flag.<br />One feeling.<br /><strong>One India.</strong></h1>
          <p>Raise the Tiranga with your own hand. Take a quiet moment with the National Anthem. Then pass it forward.</p>
          <button type="button" className={styles.soundButton} onClick={beginCeremony}><ArrowRight size={19} /> Begin the ceremony</button>
        </motion.section>}

        {(stage === "ready" || stage === "hoisting") && <motion.section key="gesture" className={styles.gesture} tabIndex={0} onKeyDown={keyboardHoist} onPointerDown={startGesture} onPointerMove={moveGesture} onPointerUp={releaseGesture} onPointerCancel={releaseGesture} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Raise the Tiranga. Swipe upward, press Arrow Up repeatedly, or use the raise button.">
          <div className={`${styles.gestureCopy} ${stage === "hoisting" ? styles.copyFaded : ""}`}>
            <span>This one is yours</span>
            <h1>{incomingName ? `${incomingName} passed it to you.` : "Raise it with your own hand."}</h1>
          </div>
          <div className={styles.srOnly} role="progressbar" aria-label="Tiranga hoisting progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>{Math.round(progress * 100)} percent raised</div>
          <div className={styles.swipeCue}><span><ChevronUp size={28} /></span><strong>{progress > 0 ? "Keep lifting" : "Swipe up to hoist"}</strong></div>
          <button className={styles.accessibleHoist} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={accessibleHoist}>Tap to raise instead</button>
        </motion.section>}

        {stage === "anthem" && <motion.section key="anthem" className={styles.anthem} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {!anthemStarted && <div><span>National Anthem</span><h1>Jana Gana Mana</h1><p>Please stand, if you are able.</p><button type="button" onClick={() => void playAnthem()}><Music2 size={19} /> Play the anthem</button>{anthemError && <p className={styles.error} role="alert">{anthemError}</p>}</div>}
          {anthemStarted && <div className={styles.srOnly} role="progressbar" aria-label="National Anthem playback" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(anthemProgress * 100)}>The National Anthem is playing. {Math.round(anthemProgress * 100)} percent complete.</div>}
        </motion.section>}

        {stage === "pride" && <motion.section key="pride" className={styles.pride} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
          <div><span>The Tiranga is flying</span><h1>Take your moment.</h1><p>Continue when you are ready.</p><button type="button" onClick={() => moveTo("personalization", "personalization_started")}>Continue <ArrowRight size={19} /></button></div>
        </motion.section>}

        {stage === "personalization" && <motion.section key="personalization" className={styles.sheet} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <span className={styles.eyebrow}>Your Tiranga</span><h2>Put your name beside it.</h2><p>We only keep your first name and city to create the card and count real participation. No age. No account.</p>
          <form onSubmit={submitPersonalization}>
            <label>First name<input value={name} onFocus={(event) => event.currentTarget.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" })} onChange={(event) => setName(event.target.value)} maxLength={28} autoComplete="given-name" required /></label>
            <label>City<input value={city} onFocus={(event) => event.currentTarget.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" })} onChange={(event) => setCity(event.target.value)} maxLength={36} autoComplete="address-level2" required /></label>
            <button type="submit" disabled={submitting}>{submitting ? "Creating your moment…" : "Create my Tiranga post"} {!submitting && <ArrowRight size={18} />}</button>
          </form>
        </motion.section>}

        {stage === "share" && <motion.section key="share" className={`${styles.sheet} ${styles.shareSheet}`} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <div className={styles.shareIntro}><span className={styles.eyebrow}>Ready to pass forward</span><h2>The Tiranga flies with you, {name.trim()}.</h2></div>
          <div className={styles.shareCard} aria-label={`Social card for ${name.trim()} in ${city.trim()}`}>
            <div className={styles.miniFlag}><span /><span><AshokaChakra /></span><span /></div><small>I raised the</small><h3>Tiranga</h3><strong>{name.trim()}</strong><p>{city.trim()} · {dateLabel}</p>{participantNumber && <em>Participant #{participantNumber.toLocaleString("en-IN")}</em>}<span>Pass it forward.</span><small className={styles.cardUrl}>{(shareUrl || "invite-link-rosy.vercel.app/tiranga").replace(/^https?:\/\//, "")}</small><footer>Made with Invite Link</footer>
          </div>
          <button type="button" className={styles.whatsappButton} onClick={shareWhatsApp}><MessageCircle size={19} /> Pass on WhatsApp</button>
          <div className={styles.shareGrid}><button type="button" onClick={() => void downloadCard("story")}><Download size={18} /> Save story</button><button type="button" onClick={copyShareLink}><Copy size={18} /> Copy link</button><button type="button" onClick={() => void nativeShare()}><Share2 size={18} /> More</button></div>

          <form className={styles.phoneDelivery} onSubmit={sendToPhone}>
            <div><strong>Send it to your own WhatsApp</strong><span id="phone-note">Optional. Your number never appears on the public card.</span></div>
            <label><span>+91</span><input type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={12} placeholder="10-digit mobile number" aria-label="Mobile number" aria-describedby="phone-note" /></label>
            {phoneError && <p className={styles.error} role="alert">{phoneError}</p>}
            <label className={styles.consent}><input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} /><span>Also send me occasional Invite Link updates. Optional and unchecked by default.</span></label>
            <button type="submit">Open in my WhatsApp <ArrowRight size={18} /></button>
          </form>

          {shareStatus && <p className={styles.status} role="status"><Check size={16} /> {shareStatus}</p>}
          <button type="button" className={styles.textButton} onClick={() => moveTo("conversion", "invite_link_cta_viewed")}>Finish <ArrowRight size={16} /></button>
        </motion.section>}

        {stage === "conversion" && <motion.section key="conversion" className={styles.conversion} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p>Your Tiranga is ready</p><h2>We&apos;ll be here next<br /><strong>15 August.</strong></h2><small>Keep your link and pass it forward. This moment belongs to you.</small><Link href="/create" onClick={() => trackEvent("invite_link_cta_clicked", { campaign: "pass_the_tiranga" })}>Made with Invite Link · Create your own <ArrowRight size={18} /></Link>
        </motion.section>}
      </AnimatePresence>
    </main>
  );
}
