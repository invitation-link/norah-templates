import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./MarketingChrome.module.css";

export function MarketingHeader() {
  return <header className={styles.header}><Link href="/" className={styles.brand}><Image src="/brand/invite-link-mark.png" alt="" width={46} height={40} /><strong>invite <span>Link</span></strong></Link><nav><Link href="/templates">Templates</Link><Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></nav><Link href="/create" className={styles.cta}>Create invitation <ArrowRight size={16} /></Link></header>;
}

export function MarketingFooter() {
  return <footer className={styles.footer}><div><Link href="/" className={styles.brand}><Image src="/brand/invite-link-mark.png" alt="" width={46} height={40} /><strong>invite <span>Link</span></strong></Link><p>Interactive invitations made to be felt.</p></div><nav><Link href="/templates">Templates</Link><Link href="/pricing">Pricing</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refund">Refunds</Link></nav><small>© 2026 Invite Link</small></footer>;
}
