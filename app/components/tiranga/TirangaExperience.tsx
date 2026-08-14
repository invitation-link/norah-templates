"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronUp, Copy, Download, MessageCircle, Music2, Share2, Volume2, VolumeX } from "lucide-react";
import { FormEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";
import { DEFAULT_TIRANGA_STATS, TirangaCommunity, TirangaStage } from "@/app/lib/tiranga";
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
  const radius = stripe * 0.34;
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

async function makeShareCard(name: string, city: string, participantNumber: number, size: "story" | "post") {
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
  context.font = "700 34px Arial";
  context.fillText("I RAISED THE", width / 2, size === "story" ? 1030 : 785);
  context.fillStyle = "#FFFFFF";
  context.font = "700 104px Georgia";
  context.fillText("TIRANGA", width / 2, size === "story" ? 1150 : 900);
  context.fillStyle = "#F2CC69";
  context.font = "700 58px Arial";
  context.fillText(name.toUpperCase(), width / 2, size === "story" ? 1270 : 1010);
  context.fillStyle = "rgba(255,255,255,.92)";
  context.font = "400 32px Arial";
  context.fillText(`${city.toUpperCase()} · 15 AUGUST 2026`, width / 2, size === "story" ? 1340 : 1070);
  context.font = "600 28px Arial";
  context.fillText(`#${participantNumber.toLocaleString("en-IN")} · PASS IT FORWARD`, width / 2, size === "story" ? 1410 : 1130);
  context.fillStyle = "rgba(255,255,255,.72)";
  context.font = "600 24px Arial";
  context.fillText("Made with Invite Link", width / 2, height - 80);

  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Card generation failed")), "image/png"));
}

export default function TirangaExperience({ incomingName, shareId, community }: TirangaExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<TirangaStage>("intro");
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState(0.08);
  const [webglReady, setWebglReady] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [anthemNeedsTap, setAnthemNeedsTap] = useState(false);
  const [anthemProgress, setAnthemProgress] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [participantNumber, setParticipantNumber] = useState(DEFAULT_TIRANGA_STATS.nationalCount + 1);
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
  const fallbackTimerRef = useRef<number | null>(null);
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
    fetch("/api/tiranga/stats", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.nationalCount) setParticipantNumber(data.nationalCount + 1); })
      .catch(() => undefined);
    const timer = window.setTimeout(() => setMuted(sessionStorage.getItem("tiranga-muted") === "true"), 0);
    return () => window.clearTimeout(timer);
  }, [community?.slug, shareId]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
    if (ropeAudioRef.current) {
      ropeAudioRef.current.rope.stop();
      void ropeAudioRef.current.context.close();
    }
  }, []);

  const ensureRopeAudio = () => {
    if (muted || ropeAudioRef.current) return;
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
    moveTo("personalization", "personalization_started");
  }, [moveTo]);

  const playAnthem = useCallback(async () => {
    const audio = anthemAudioRef.current;
    if (!audio || !soundEnabled || muted) {
      fallbackTimerRef.current = window.setTimeout(finishAnthem, reduceMotion ? 800 : 3600);
      return;
    }
    try {
      audio.currentTime = 0;
      audio.volume = 1;
      await audio.play();
      setAnthemNeedsTap(false);
      trackEvent("anthem_started", { campaign: "pass_the_tiranga" });
    } catch {
      setAnthemNeedsTap(true);
    }
  }, [finishAnthem, muted, reduceMotion, soundEnabled]);

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
    const duration = reduceMotion ? 120 : 760;
    const unfurl = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setReveal(from + (1 - from) * eased);
      if (elapsed < 1) animationRef.current = requestAnimationFrame(unfurl);
      else {
        animationRef.current = null;
        moveTo("anthem", "anthem_viewed");
        void playAnthem();
      }
    };
    animationRef.current = requestAnimationFrame(unfurl);
  }, [moveTo, playAnthem, quietRope, reduceMotion, reveal, updateProgress]);

  const chooseSound = async (withSound: boolean) => {
    setSoundEnabled(withSound);
    setMuted(!withSound);
    sessionStorage.setItem("tiranga-muted", String(!withSound));
    if (withSound && anthemAudioRef.current) {
      try {
        const audio = anthemAudioRef.current;
        audio.volume = 0;
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
      } catch {
        // The anthem screen offers a direct play control if the browser blocks this primer.
      }
    }
    moveTo("ready", withSound ? "sound_enabled" : "sound_skipped");
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
    const next = (dragStartRef.current - event.clientY) / distance;
    updateProgress(Math.max(previous, next));
    setRopeVolume(Math.abs(next - previous) * distance * 60);
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
        setParticipantNumber(result.participantNumber);
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
      const blob = await makeShareCard(name.trim(), city.trim(), participantNumber, "story");
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
    const blob = await makeShareCard(name.trim(), city.trim(), participantNumber, size);
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
    setSoundEnabled(!next);
    sessionStorage.setItem("tiranga-muted", String(next));
    if (ropeAudioRef.current) ropeAudioRef.current.gain.gain.value = 0.0001;
  };

  const showCanvas = stage !== "conversion";
  const showPresentation = showCanvas && stage !== "unfurling" && stage !== "anthem";

  return (
    <main className={styles.shell} style={{ "--progress": progress, "--reveal": reveal } as React.CSSProperties}>
      <audio ref={anthemAudioRef} src="/audio/jana-gana-mana.mp3" preload="auto" onTimeUpdate={(event) => {
        const audio = event.currentTarget;
        setAnthemProgress(audio.duration ? audio.currentTime / audio.duration : 0);
      }} onEnded={finishAnthem} />
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.sun} aria-hidden="true" />
      {showCanvas && <FlagScene progress={progress} reveal={reveal} active reducedMotion={Boolean(reduceMotion)} onReady={webglReadyHandler} />}
      {showCanvas && <div className={`${styles.fallbackFlag} ${webglReady ? styles.webglLoaded : ""}`} style={{ transform: `translateY(${(1 - progress) * 54}vh) scaleX(${Math.max(0.08, reveal)})` }} aria-hidden="true">
        <span /><span><AshokaChakra className={styles.flagChakra} /></span><span />
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
          <button type="button" className={styles.soundButton} onClick={() => void chooseSound(true)}><Music2 size={19} /> Begin with sound</button>
          <button type="button" className={styles.quietButton} onClick={() => void chooseSound(false)}>Continue without sound</button>
        </motion.section>}

        {(stage === "ready" || stage === "hoisting") && <motion.section key="gesture" className={styles.gesture} onPointerDown={startGesture} onPointerMove={moveGesture} onPointerUp={releaseGesture} onPointerCancel={releaseGesture} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className={`${styles.gestureCopy} ${stage === "hoisting" ? styles.copyFaded : ""}`}>
            <span>This one is yours</span>
            <h1>{incomingName ? `${incomingName} passed it to you.` : "Raise it with your own hand."}</h1>
          </div>
          <div className={styles.swipeCue}><span><ChevronUp size={28} /></span><strong>{progress > 0 ? "Keep lifting" : "Swipe up to hoist"}</strong></div>
          <button className={styles.accessibleHoist} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={accessibleHoist}>Tap to raise instead</button>
        </motion.section>}

        {stage === "anthem" && <motion.section key="anthem" className={styles.anthem} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div><span>National Anthem</span><h1>Jana Gana Mana</h1><p>A quiet moment for the flag we share.</p>{anthemNeedsTap && <button type="button" onClick={() => void playAnthem()}><Music2 size={19} /> Play the National Anthem</button>}</div>
          <i aria-hidden="true"><b style={{ width: `${anthemProgress * 100}%` }} /></i>
        </motion.section>}

        {stage === "personalization" && <motion.section key="personalization" className={styles.sheet} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <span className={styles.eyebrow}>Your Tiranga</span><h2>Make this moment yours.</h2><p>Your name and city appear on the share card. No age. No account.</p>
          <form onSubmit={submitPersonalization}>
            <label>First name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={28} autoComplete="given-name" required /></label>
            <label>City<input value={city} onChange={(event) => setCity(event.target.value)} maxLength={36} autoComplete="address-level2" required /></label>
            <button type="submit" disabled={submitting}>{submitting ? "Creating your moment…" : "Create my Tiranga post"} {!submitting && <ArrowRight size={18} />}</button>
          </form>
        </motion.section>}

        {stage === "share" && <motion.section key="share" className={`${styles.sheet} ${styles.shareSheet}`} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <div className={styles.shareIntro}><span className={styles.eyebrow}>Ready to pass forward</span><h2>The Tiranga flies with you, {name.trim()}.</h2></div>
          <div className={styles.shareCard} aria-label={`Social card for ${name.trim()} in ${city.trim()}`}>
            <div className={styles.miniFlag}><span /><span><AshokaChakra /></span><span /></div><small>I raised the</small><h3>Tiranga</h3><strong>{name.trim()}</strong><p>{city.trim()} · 15 August 2026</p><em>#{participantNumber.toLocaleString("en-IN")}</em><span>Pass it forward.</span><footer>Made with Invite Link</footer>
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
          <Image src="/brand/invite-link-lockup.png" alt="Invite Link" width={150} height={131} /><p>Made with Invite Link</p><h2>Create something people don&apos;t just open.<br /><strong>They feel.</strong></h2><Link href="/create" onClick={() => trackEvent("invite_link_cta_clicked", { campaign: "pass_the_tiranga" })}>Create your Invite Link <ArrowRight size={19} /></Link><small>Interactive invitations for weddings, birthdays, housewarmings and moments worth sharing.</small>
        </motion.section>}
      </AnimatePresence>
    </main>
  );
}
