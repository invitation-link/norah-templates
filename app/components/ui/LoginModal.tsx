"use client";

import Image from "next/image";
import { ArrowRight, Loader2, Mail, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signInWithGoogle, signInWithMagicLink } from "@/lib/auth";
import styles from "./LoginModal.module.css";
import { trackEvent } from "@/app/lib/analytics";

interface LoginModalProps { isOpen: boolean; onClose: () => void; redirectTo?: string; }

export function LoginModal({ isOpen, onClose, redirectTo }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleContinue = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Enter a valid email address"); return; }
    setLoading(true);
    trackEvent("auth_started", { method: "email_magic_link" });
    const result = await signInWithMagicLink(email, redirectTo);
    setLoading(false);
    if (!result.success) { toast.error(result.error || "Could not sign in"); return; }
    toast.success("Check your email for a secure sign-in link");
  };

  const handleGoogle = async () => {
    setLoading(true);
    trackEvent("auth_started", { method: "google" });
    const result = await signInWithGoogle(redirectTo);
    if (!result.success) { setLoading(false); toast.error(result.error || "Could not sign in with Google"); }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="login-title">
      <button type="button" className={styles.backdrop} onClick={onClose} aria-label="Close sign in" />
      <section className={styles.modal}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close sign in"><X size={19} /></button>
        <Image src="/brand/invite-link-mark.png" alt="" width={72} height={63} />
        <span>Save and publish</span>
        <h2 id="login-title">Keep your invitation close.</h2>
        <p>Sign in only when you are ready to publish. Your draft stays exactly as you made it.</p>
        <button type="button" className={styles.google} onClick={handleGoogle} disabled={loading}><strong>G</strong> Continue with Google <ArrowRight size={17} /></button>
        <div className={styles.divider}><span>or use a secure email link</span></div>
        <form onSubmit={handleContinue}>
          <label htmlFor="login-email">Email address</label>
          <div className={styles.phone}><input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={loading} /></div>
          <button type="submit" className={styles.submit} disabled={loading || !email}>{loading ? <Loader2 className={styles.spin} /> : <Mail size={17} />} Email me a secure link</button>
        </form>
        <small>By continuing, you agree to keep every invitation respectful and lawful.</small>
      </section>
    </div>
  );
}
