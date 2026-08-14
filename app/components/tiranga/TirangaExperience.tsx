"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronUp, Copy, Download, MapPin, Share2, Volume2, VolumeX } from "lucide-react";
import { FormEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";
import { DEFAULT_TIRANGA_STATS, TirangaCommunity, TirangaStage, TirangaStats } from "@/app/lib/tiranga";
import styles from "./TirangaExperience.module.css";

const FlagScene = dynamic(() => import("./FlagScene"), { ssr: false });

type TirangaExperienceProps = {
  incomingName?: string;
  shareId?: string;
  community?: TirangaCommunity;
};

type AudioState = {
  context: AudioContext;
  rope: OscillatorNode;
  ropeGain: GainNode;
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

function IndiaMap({ stats }: { stats: TirangaStats }) {
  return (
    <svg className={styles.indiaMap} viewBox="0 0 300 350" role="img" aria-label="Aggregated Tiranga activity across Indian cities">
      <path d="M126 8 L160 25 L183 55 L218 67 L232 97 L218 119 L273 127 L282 151 L249 159 L229 174 L204 181 L195 211 L175 226 L166 268 L148 331 L128 278 L111 249 L92 225 L72 195 L43 178 L54 151 L37 127 L65 108 L78 74 L99 61 L103 32 Z" />
      {stats.cities.slice(0, 20).map((city, index) => (
        <g key={city.city} className={styles.mapPulse} style={{ animationDelay: `${index * 0.16}s` }}>
          <circle cx={city.x} cy={city.y} r="3.5" />
          <circle cx={city.x} cy={city.y} r="8" className={styles.mapRing} />
        </g>
      ))}
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
  gradient.addColorStop(0.5, "#123a58");
  gradient.addColorStop(1, "#e39a57");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  const glow = context.createRadialGradient(width * 0.68, height * 0.64, 10, width * 0.68, height * 0.64, width * 0.58);
  glow.addColorStop(0, "rgba(255,224,158,.8)");
  glow.addColorStop(1, "rgba(255,180,90,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  drawFlag(context, 130, size === "story" ? 250 : 120, 820);
  context.textAlign = "center";
  context.fillStyle = "#FFFFFF";
  context.font = "700 42px Arial";
  context.fillText("I HOISTED THE", width / 2, size === "story" ? 1030 : 820);
  context.font = "700 104px Georgia";
  context.fillText("TIRANGA", width / 2, size === "story" ? 1150 : 930);
  context.fillStyle = "#F2CC69";
  context.font = "700 58px Arial";
  context.fillText(name.toUpperCase(), width / 2, size === "story" ? 1270 : 1035);
  context.fillStyle = "rgba(255,255,255,.9)";
  context.font = "400 32px Arial";
  context.fillText(`${city.toUpperCase()} · 15 AUGUST 2026`, width / 2, size === "story" ? 1340 : 1095);
  context.font = "400 28px Arial";
  context.fillText(`#${participantNumber.toLocaleString("en-IN")} · NOW IT'S YOUR TURN`, width / 2, size === "story" ? 1410 : 1150);
  context.fillStyle = "rgba(255,255,255,.72)";
  context.font = "600 24px Arial";
  context.fillText("Made with Invite Link · Hoist yours. Pass it on.", width / 2, height - 80);

  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Card generation failed")), "image/png"));
}

export default function TirangaExperience({ incomingName, shareId, community }: TirangaExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<TirangaStage>("intro");
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState(0.08);
  const [webglReady, setWebglReady] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [stats, setStats] = useState<TirangaStats>(DEFAULT_TIRANGA_STATS);
  const [participantNumber, setParticipantNumber] = useState(DEFAULT_TIRANGA_STATS.nationalCount + 1);
  const [shareUrl, setShareUrl] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [muted, setMuted] = useState(false);
  const [instructionSeen, setInstructionSeen] = useState(false);
  const progressRef = useRef(0);
  const pointerRef = useRef<number | null>(null);
  const dragStartRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const audioRef = useRef<AudioState | null>(null);
  const milestonesRef = useRef(new Set<number>());
  const webglReadyHandler = useCallback(() => setWebglReady(true), []);

  const moveTo = useCallback((next: TirangaStage, eventName?: string) => {
    setStage(next);
    if (eventName) trackEvent(eventName, { campaign: "pass_the_tiranga", community: community?.slug });
  }, [community?.slug]);

  useEffect(() => {
    trackEvent("tiranga_open", { campaign: "pass_the_tiranga", referral: Boolean(shareId), community: community?.slug });
    const introTimer = window.setTimeout(() => {
      moveTo("ready", "intro_loaded");
    }, reduceMotion ? 150 : 1100);
    fetch("/api/tiranga/stats", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((data) => {
      if (data?.nationalCount) {
        setStats(data);
        setParticipantNumber(data.nationalCount + 1);
      }
    }).catch(() => undefined);
    const muteTimer = window.setTimeout(() => setMuted(sessionStorage.getItem("tiranga-muted") === "true"), 0);
    return () => { window.clearTimeout(introTimer); window.clearTimeout(muteTimer); };
  }, [community?.slug, moveTo, reduceMotion, shareId]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    if (audioRef.current) {
      audioRef.current.rope.stop();
      void audioRef.current.context.close();
    }
  }, []);

  const ensureAudio = () => {
    if (muted || audioRef.current) return;
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = new AudioContextConstructor();
    const rope = context.createOscillator();
    const ropeGain = context.createGain();
    rope.type = "triangle";
    rope.frequency.value = 72;
    ropeGain.gain.value = 0.0001;
    rope.connect(ropeGain);
    ropeGain.connect(context.destination);
    rope.start();
    audioRef.current = { context, rope, ropeGain };
  };

  const setRopeVolume = (velocity: number) => {
    const audio = audioRef.current;
    if (!audio || muted) return;
    const now = audio.context.currentTime;
    audio.ropeGain.gain.cancelScheduledValues(now);
    audio.ropeGain.gain.linearRampToValueAtTime(Math.min(0.018, 0.003 + velocity * 0.00008), now + 0.05);
    audio.rope.frequency.linearRampToValueAtTime(66 + Math.min(54, velocity * 0.2), now + 0.05);
  };

  const quietRope = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.ropeGain.gain.linearRampToValueAtTime(0.0001, audio.context.currentTime + 0.12);
  }, []);

  const playResolution = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || muted) return;
    const { context } = audio;
    const master = context.createGain();
    master.connect(context.destination);
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.08);
    master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.65);
    [392, 523.25, 659.25].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.connect(master);
      oscillator.start(context.currentTime + index * 0.07);
      oscillator.stop(context.currentTime + 1.6);
    });
  }, [muted]);

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

  const finishHoist = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    updateProgress(1);
    quietRope();
    moveTo("unfurling");
    trackEvent("hoist_completed", { campaign: "pass_the_tiranga" });
    if (navigator.vibrate) navigator.vibrate(34);
    playResolution();

    const from = reveal;
    const startedAt = performance.now();
    const duration = reduceMotion ? 120 : 760;
    const unfurl = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setReveal(from + (1 - from) * eased);
      if (elapsed < 1) animationRef.current = requestAnimationFrame(unfurl);
      else {
        moveTo("pride");
        window.setTimeout(() => moveTo("personalization", "personalization_started"), reduceMotion ? 450 : 1900);
      }
    };
    animationRef.current = requestAnimationFrame(unfurl);
  }, [moveTo, playResolution, quietRope, reduceMotion, reveal, updateProgress]);

  const startGesture = (event: PointerEvent<HTMLElement>) => {
    if (completedRef.current || (stage !== "ready" && stage !== "hoisting")) return;
    ensureAudio();
    pointerRef.current = event.pointerId;
    const distance = Math.min(window.innerHeight * 0.58, 520);
    dragStartRef.current = event.clientY + progressRef.current * distance;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (stage !== "hoisting") {
      moveTo("hoisting");
      trackEvent("hoist_started", { campaign: "pass_the_tiranga" });
    }
    setInstructionSeen(true);
  };

  const moveGesture = (event: PointerEvent<HTMLElement>) => {
    if (pointerRef.current !== event.pointerId) return;
    const distance = Math.min(window.innerHeight * 0.58, 520);
    const previous = progressRef.current;
    const next = (dragStartRef.current - event.clientY) / distance;
    updateProgress(next);
    setRopeVolume(Math.abs(next - previous) * distance * 60);
  };

  const releaseGesture = (event: PointerEvent<HTMLElement>) => {
    if (pointerRef.current !== event.pointerId) return;
    pointerRef.current = null;
    quietRope();
    if (progressRef.current >= 0.65) tweenProgress(1, reduceMotion ? 100 : 430, finishHoist);
    else tweenProgress(0, reduceMotion ? 100 : 360, () => moveTo("ready"));
  };

  const accessibleHoist = () => {
    ensureAudio();
    setInstructionSeen(true);
    moveTo("hoisting");
    trackEvent("hoist_started", { campaign: "pass_the_tiranga", input: "accessible_button" });
    tweenProgress(1, reduceMotion ? 120 : 900, finishHoist);
  };

  const submitPersonalization = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanCity = city.trim();
    if (!cleanName || !cleanCity) return;
    try {
      const response = await fetch("/api/tiranga/participate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, city: cleanCity, referredBy: shareId, community: community?.slug }),
      });
      if (response.ok) {
        const result = await response.json();
        setParticipantNumber(result.participantNumber);
        setStats((current) => ({ ...current, nationalCount: result.nationalCount }));
      }
    } catch {
      // The ceremony remains usable if the campaign API is temporarily unavailable.
    }
    moveTo("chain", "personalization_completed");
    trackEvent("chain_viewed", { campaign: "pass_the_tiranga", referral: Boolean(incomingName) });
  };

  const openShare = async () => {
    moveTo("share", "share_opened");
    try {
      const response = await fetch("/api/tiranga/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), city: city.trim(), parentShareId: shareId, community: community?.slug }),
      });
      if (response.ok) {
        const result = await response.json();
        setShareUrl(result.url);
        return;
      }
    } catch {
      // Use the current campaign URL as a resilient sharing fallback.
    }
    setShareUrl(`${window.location.origin}/tiranga`);
  };

  const nativeShare = async () => {
    const url = shareUrl || `${window.location.origin}/tiranga`;
    const text = `${name.trim()} passed the Tiranga to you. Hoist yours and pass it on.`;
    try {
      const blob = await makeShareCard(name.trim(), city.trim(), participantNumber, "story");
      const file = new File([blob], "pass-the-tiranga.png", { type: "image/png" });
      const shareFunction = Reflect.get(navigator, "share") as undefined | ((data: ShareData) => Promise<void>);
      const canShareFunction = Reflect.get(navigator, "canShare") as undefined | ((data: ShareData) => boolean);
      if (shareFunction) {
        const data: ShareData = { title: "Pass the Tiranga", text, url };
        if (canShareFunction?.call(navigator, { files: [file] })) data.files = [file];
        await shareFunction.call(navigator, data);
        setShareStatus("Shared");
        trackEvent("share_native", { campaign: "pass_the_tiranga" });
        return;
      }
    } catch {
      // Fall through to WhatsApp when native sharing is unavailable or cancelled.
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener,noreferrer");
    trackEvent("share_whatsapp", { campaign: "pass_the_tiranga", fallback: true });
  };

  const shareWhatsApp = () => {
    const url = shareUrl || `${window.location.origin}/tiranga`;
    const text = `${name.trim()} passed the Tiranga to you. Hoist yours and pass it on.\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    trackEvent("share_whatsapp", { campaign: "pass_the_tiranga" });
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
    setShareStatus(size === "story" ? "Story saved" : "Post saved");
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    sessionStorage.setItem("tiranga-muted", String(next));
    if (audioRef.current) audioRef.current.ropeGain.gain.value = 0.0001;
  };

  const chain = incomingName ? [incomingName, name.trim() || "You"] : ["The chain began", name.trim() || "You"];
  const showCeremonyUi = stage === "intro" || stage === "ready" || stage === "hoisting";
  const showCanvas = stage !== "conversion";
  const showPresentation = showCanvas && stage !== "unfurling" && stage !== "pride";

  return (
    <main className={styles.shell} style={{ "--progress": progress, "--reveal": reveal } as React.CSSProperties}>
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.sun} aria-hidden="true" />
      <div className={styles.city} aria-hidden="true" />
      {showCanvas && <FlagScene progress={progress} reveal={reveal} active reducedMotion={Boolean(reduceMotion)} onReady={webglReadyHandler} />}
      {showCanvas && <div className={`${styles.fallbackFlag} ${webglReady ? styles.webglLoaded : ""}`} style={{ transform: `translateY(${(1 - progress) * 54}vh) scaleX(${Math.max(0.08, reveal)})` }} aria-hidden="true">
        <span /><span><AshokaChakra className={styles.flagChakra} /></span><span />
      </div>}

      {showPresentation && <header className={styles.presentation}>
        <div><Image src="/brand/invite-link-mark.png" alt="" width={28} height={25} /><span>Invite Link presents</span></div>
        <button type="button" onClick={toggleSound} aria-label={muted ? "Turn ceremonial sound on" : "Mute ceremonial sound"}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
      </header>}

      <AnimatePresence mode="wait">
        {showCeremonyUi && <motion.section
          key="ceremony"
          className={styles.gesture}
          onPointerDown={startGesture}
          onPointerMove={moveGesture}
          onPointerUp={releaseGesture}
          onPointerCancel={releaseGesture}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={`${styles.introCopy} ${stage === "hoisting" ? styles.copyFaded : ""}`}>
            <span>{community ? community.name : "Pass the Tiranga"}</span>
            <h1>{stage === "intro" ? "A Tiranga is waiting for you." : community ? `Hoist with ${community.name}.` : incomingName ? `${incomingName} passed this to you.` : "This one is yours."}</h1>
            <p>Hoist it. Make it yours. Pass it on.</p>
          </div>
          <div className={styles.progressMeter} aria-hidden="true"><i><b style={{ height: `${Math.max(5, progress * 100)}%` }} /></i><span>{Math.round(progress * 100)}%</span></div>
          {!instructionSeen && stage !== "intro" && <div className={styles.swipeCue}><span><ChevronUp size={25} /></span><strong>Swipe up to hoist</strong></div>}
          {stage === "hoisting" && <div className={styles.keepRaising}>Keep raising</div>}
          <button className={styles.accessibleHoist} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={accessibleHoist}>Hoist without swiping</button>
        </motion.section>}

        {(stage === "unfurling" || stage === "pride") && <motion.section key="pride" className={styles.pride} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="The Tiranga is flying" />}

        {stage === "personalization" && <motion.section key="personalization" className={styles.sheet} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <span className={styles.eyebrow}>Your Tiranga</span>
          <h2>Put your name beside it.</h2>
          <p>Just two details. No account, no OTP.</p>
          <form onSubmit={submitPersonalization}>
            <label>First name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={28} autoComplete="given-name" required /></label>
            <label>City<input value={city} onChange={(event) => setCity(event.target.value)} maxLength={36} autoComplete="address-level2" required /></label>
            <button type="submit">Make it mine <ArrowRight size={17} /></button>
          </form>
        </motion.section>}

        {stage === "chain" && <motion.section key="chain" className={styles.sheet} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <span className={styles.eyebrow}>The Tiranga reached you</span>
          <h2>The Tiranga flies with you, {name.trim()}.</h2>
          <p><MapPin size={14} /> {city.trim()} · 15 August 2026</p>
          <div className={styles.counter}><strong>{stats.nationalCount.toLocaleString("en-IN")}</strong><span>Tirangas flying across India</span></div>
          <div className={styles.chain}>
            {chain.map((person, index) => <div key={`${person}-${index}`}><i /><span>{person}</span>{index < chain.length - 1 && <b />}</div>)}
            <div><i className={styles.emptyNode} /><span>Who&apos;s next?</span></div>
          </div>
          <button type="button" className={styles.primaryButton} onClick={openShare}>Pass the Tiranga <ArrowRight size={17} /></button>
        </motion.section>}

        {stage === "share" && <motion.section key="share" className={`${styles.sheet} ${styles.shareSheet}`} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
          <div className={styles.shareCard}>
            <div className={styles.miniFlag}><span /><span><AshokaChakra /></span><span /></div>
            <small>I hoisted the</small><h2>Tiranga</h2><strong>{name.trim()}</strong>
            <p>{city.trim()} · 15 August 2026</p><em>#{participantNumber.toLocaleString("en-IN")}</em>
            <span>Now it&apos;s your turn.</span><footer>Made with Invite Link</footer>
          </div>
          <button type="button" className={styles.whatsappButton} onClick={shareWhatsApp}>Pass on WhatsApp <Share2 size={17} /></button>
          <div className={styles.shareGrid}>
            <button type="button" onClick={nativeShare}><Share2 size={16} /> More</button>
            <button type="button" onClick={copyShareLink}><Copy size={16} /> Copy link</button>
            <button type="button" onClick={() => void downloadCard("story")}><Download size={16} /> Story 9:16</button>
            <button type="button" onClick={() => void downloadCard("post")}><Download size={16} /> Post 4:5</button>
          </div>
          {shareStatus && <p className={styles.status} role="status"><Check size={14} /> {shareStatus}</p>}
          <button type="button" className={styles.textButton} onClick={() => moveTo("map", "map_viewed")}>Watch India rise <ArrowRight size={15} /></button>
        </motion.section>}

        {stage === "map" && <motion.section key="map" className={`${styles.sheet} ${styles.mapSheet}`} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
          <span className={styles.eyebrow}>Live moment</span>
          <h2><strong>{stats.nationalCount.toLocaleString("en-IN")}</strong>Tirangas flying</h2>
          <IndiaMap stats={stats} />
          <p>One flag. A billion hearts.</p>
          <button type="button" className={styles.primaryButton} onClick={() => { moveTo("conversion", "invite_link_cta_viewed"); }}>Continue <ArrowRight size={17} /></button>
        </motion.section>}

        {stage === "conversion" && <motion.section key="conversion" className={styles.conversion} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Image src="/brand/invite-link-lockup.png" alt="Invite Link" width={150} height={131} />
          <p>Loved this experience?</p>
          <h2>Create something people don&apos;t just open.<br /><strong>They experience.</strong></h2>
          <Link href="/create" onClick={() => trackEvent("invite_link_cta_clicked", { campaign: "pass_the_tiranga" })}>Create your Invite Link <ArrowRight size={18} /></Link>
          <nav aria-label="Explore invitation categories"><Link href="/occasions/wedding">Wedding</Link><Link href="/occasions/housewarming">Housewarming</Link><Link href="/occasions/birthday">Birthday</Link><Link href="/occasions/celebrations">Celebration</Link></nav>
          <small>Interactive invitations · Share instantly · Track responses</small>
        </motion.section>}
      </AnimatePresence>
    </main>
  );
}
