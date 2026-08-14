import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import TirangaExperience from "@/app/components/tiranga/TirangaExperience";

const title = "Digital Tiranga — An Interactive Independence Day Experience";
const description = "Raise the Tiranga, make a personal pledge and share a meaningful Independence Day moment—created by Invite Link.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/tiranga` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tiranga`,
    siteName: "Invite Link",
    title,
    description,
    images: [{
      url: "/images/templates/live/digital-tiranga-hero.png",
      width: 1792,
      height: 896,
      alt: "An Indian community gathering at sunrise for a Tiranga ceremony",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/templates/live/digital-tiranga-hero.png"],
  },
};

export default function DigitalTirangaPage() {
  return <TirangaExperience />;
}
