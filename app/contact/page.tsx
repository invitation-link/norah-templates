import type { Metadata } from "next";
import { MarketingFooter, MarketingHeader } from "@/app/components/marketing/MarketingChrome";
import BespokeForm from "./BespokeForm";
import styles from "../marketing-pages.module.css";
export const metadata:Metadata={title:"Contact and Bespoke Invitations",description:"Ask a question or request a bespoke interactive invitation from Invite Link."};
export default function ContactPage(){return <main className={styles.page}><MarketingHeader/><section className={styles.hero}><span>Talk to a human</span><h1>Some invitations should exist only once.</h1><p>For a new interaction, custom ritual or one-of-one visual direction, send us the story behind the occasion.</p></section><section className={styles.content}><div className={styles.contactGrid}><aside><span className={styles.sectionLabel}>Bespoke starts at ₹4,999</span><h2>Your occasion, choreographed from scratch.</h2><p>We review every brief before quoting. Standard product questions are welcome too.</p><a href="mailto:hello@invitelink.shop">hello@invitelink.shop</a></aside><BespokeForm/></div></section><MarketingFooter/></main>}
