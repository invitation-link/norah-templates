import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingFooter, MarketingHeader } from "@/app/components/marketing/MarketingChrome";
import { PRODUCT_TEMPLATES, getProductTemplate } from "@/app/lib/product-templates";
import { SITE_URL } from "@/app/lib/site";
import styles from "./TemplateDetail.module.css";
import TemplateViewTracker from "./TemplateViewTracker";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return PRODUCT_TEMPLATES.map(template=>({slug:template.id}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const template=getProductTemplate(slug);if(!template)return{};return{title:`${template.name} ${template.occasionLabel} Invitation Template`,description:template.description,alternates:{canonical:`${SITE_URL}/templates/${template.id}`},openGraph:{title:`${template.name} | Invite Link`,description:template.description,images:[template.previewImage]}}}
export default async function TemplateDetail({params}:Props){const{slug}=await params;const template=getProductTemplate(slug);if(!template)notFound();return <main className={styles.page}><TemplateViewTracker templateId={template.id} occasion={template.occasion}/><MarketingHeader/><section className={styles.hero}><div className={styles.copy}><span>{template.occasionLabel} · {template.tier}</span><h1>{template.name}</h1><p>{template.description}</p><div><Link href={template.liveUrl}><Play size={17} fill="currentColor"/>Try the live invitation</Link><Link href={template.editorUrl||"/create"}>Customize this design<ArrowRight size={17}/></Link></div></div><div className={styles.visual}><Image src={template.previewImage} alt={`${template.name} opening screen`} fill priority sizes="(max-width:800px) 90vw,44vw"/></div></section><section className={styles.details}><div><span>How it begins</span><h2>{template.interaction}</h2><p>The interaction is preserved while you personalize the names, date, venue and story.</p></div><ul><li><Check/>Opens beautifully in a mobile browser</li><li><Check/>Shares as one link on WhatsApp</li><li><Check/>Includes maps and private RSVP</li><li><Check/>Can be edited from My Invitations</li></ul></section><section className={styles.cta}><span>One-time plans from ₹399</span><h2>Make {template.name} yours.</h2><Link href={template.editorUrl||"/create"}>Start personalizing<ArrowRight size={18}/></Link></section><MarketingFooter/></main>}
