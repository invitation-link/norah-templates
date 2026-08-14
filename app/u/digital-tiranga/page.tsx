import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import TirangaExperience from "@/app/components/tiranga/TirangaExperience";

const title = "Digital Tiranga — An Interactive Independence Day Experience";
const description = "A Tiranga is waiting for you. Raise it by hand, stand with the anthem and pass the moment forward—created by Invite Link.";

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
      url: "/tiranga/opengraph-image",
      width: 1200,
      height: 630,
      alt: "A Tiranga is waiting for you — hoist it and pass it forward",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/tiranga/opengraph-image"],
  },
};

export default function DigitalTirangaPage() {
  return <TirangaExperience />;
}
