import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingFooter, MarketingHeader } from "@/app/components/marketing/MarketingChrome";
import styles from "../marketing-pages.module.css";

export const metadata: Metadata = { title: "Invitation Pricing", description: "One-time pricing for free, Essential, Premium and bespoke interactive invitations in India." };
const plans = [
  { label:"Ad-supported",name:"Free",price:"₹0",text:"A complete basic invitation with RSVP.",features:["Names, date, venue and message","Invite Link credit","One end-of-invite sponsor"],href:"/create",cta:"Create free" },
  { label:"Most accessible",name:"Essential",price:"₹399",text:"Full standard-template customization.",features:["Custom invitation slug","No third-party ads","All standard content fields"],href:"/create",cta:"Choose Essential" },
  { label:"Best experience",name:"Premium",price:"₹999",text:"Premium interactions and guest insights.",features:["Gallery and music","Invitation analytics","No Invite Link branding"],href:"/create",cta:"Choose Premium",featured:true },
  { label:"Made for you",name:"Bespoke",price:"₹4,999+",text:"A new invitation concept crafted around your occasion.",features:["Custom creative direction","Unique interaction","Personal delivery support"],href:"/contact#bespoke",cta:"Request a quote" },
];
export default function PricingPage(){return <main className={styles.page}><MarketingHeader/><section className={styles.hero}><span>Simple, one-time pricing</span><h1>Pay for the invitation. Not another subscription.</h1><p>Start free, upgrade when the occasion deserves more, or commission something entirely your own.</p></section><section className={styles.content}><div className={styles.intro}><div><span className={styles.sectionLabel}>Choose your level</span><h2>Every plan begins with a live experience.</h2></div><p>Prices are per invitation in INR. Essential and Premium remove third-party advertising. Bespoke work begins with a written scope and quote.</p></div><div className={styles.plans}>{plans.map(plan=><article key={plan.name} className={`${styles.plan} ${plan.featured?styles.planFeatured:""}`}><span>{plan.label}</span><h2>{plan.name}</h2><strong className={styles.price}>{plan.price}<small> one time</small></strong><p>{plan.text}</p><ul>{plan.features.map(feature=><li key={feature}>✓ {feature}</li>)}</ul><Link href={plan.href}>{plan.cta}<ArrowRight size={16}/></Link></article>)}</div><p className={styles.note}>Razorpay supports UPI, cards and net banking. Taxes, if applicable, are shown before payment. Paid digital services are handled under the published refund policy.</p></section><MarketingFooter/></main>}
