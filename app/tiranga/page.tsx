import type { Metadata } from "next";
import TirangaExperience from "@/app/components/tiranga/TirangaExperience";
import { SITE_URL } from "@/app/lib/site";

const title = "Pass the Tiranga — Interactive Digital Flag Hoisting";
const description = "Hoist the Tiranga with your finger, add your name and city, then pass the experience to someone you care about. Powered by Invite Link.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["digital flag hoisting", "Pass the Tiranga", "Independence Day digital experience", "interactive Tiranga"],
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
