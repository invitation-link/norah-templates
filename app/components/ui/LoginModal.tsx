"use client";

import Image from "next/image";
import { ArrowRight, Loader2, Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signInWithGoogle, signInWithPseudoPhone } from "@/lib/auth";
import styles from "./LoginModal.module.css";

interface LoginModalProps { isOpen: boolean; onClose: () => void; onSuccess?: () => void; redirectTo?: string; }

export function LoginModal({ isOpen, onClose, onSuccess, redirectTo }: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleContinue = async (event: React.FormEvent) => {
    event.preventDefault();
    if (phone.length !== 10) { toast.error("Enter a valid 10-digit phone number"); return; }
    setLoading(true);
    const result = await signInWithPseudoPhone(phone);
    setLoading(false);
    if (!result.success) { toast.error(result.error || "Could not sign in"); return; }
    toast.success("Welcome to Invite Link"); onSuccess?.(); onClose();
    if (redirectTo) window.location.href = redirectTo;
  };

  const handleGoogle = async () => {
    setLoading(true);
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
        <div className={styles.divider}><span>or use your phone</span></div>
        <form onSubmit={handleContinue}>
          <label htmlFor="login-phone">Mobile number</label>
          <div className={styles.phone}><span>+91</span><input id="login-phone" type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" disabled={loading} /></div>
          <button type="submit" className={styles.submit} disabled={loading || phone.length !== 10}>{loading ? <Loader2 className={styles.spin} /> : <Phone size={17} />} Continue to publish</button>
        </form>
        <small>By continuing, you agree to keep every invitation respectful and lawful.</small>
      </section>
    </div>
  );
}
