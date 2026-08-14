import type { Metadata } from "next";
import TirangaExperience from "@/app/components/tiranga/TirangaExperience";
import { SITE_URL } from "@/app/lib/site";

const title = "Hoist the Tiranga — An Interactive Independence Day Experience";
const description = "A Tiranga is waiting for you. Raise it with your own hand, stand with the anthem and pass it forward in one personal link by Invite Link.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["digital flag hoisting", "Pass the Tiranga", "Independence Day experience", "interactive Tiranga", "15 August digital invitation"],
  alternates: { canonical: `${SITE_URL}/tiranga` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tiranga`,
    siteName: "Invite Link",
    title,
    description,
    images: [`${SITE_URL}/tiranga/opengraph-image`],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/tiranga/opengraph-image`] },
};

export default function TirangaCampaignPage() {
  return <TirangaExperience />;
}
