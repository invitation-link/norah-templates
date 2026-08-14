import type { Metadata } from "next";
import TirangaExperience from "@/app/components/tiranga/TirangaExperience";
import { SITE_URL } from "@/app/lib/site";
import { safeFirstName } from "@/app/lib/tiranga";

type PageProps = { params: Promise<{ shareId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareId } = await params;
  const inviter = safeFirstName(shareId);
  const title = `${inviter} passed the Tiranga to you`;
  const description = "A Tiranga is waiting for you. Hoist yours, make it personal and pass it on.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/tiranga` },
    robots: { index: false, follow: true },
    openGraph: { type: "website", url: `${SITE_URL}/tiranga/${shareId}`, siteName: "Invite Link", title, description, images: [`${SITE_URL}/tiranga/${shareId}/opengraph-image`] },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/tiranga/${shareId}/opengraph-image`] },
  };
}

export default async function SharedTirangaPage({ params }: PageProps) {
  const { shareId } = await params;
  return <TirangaExperience incomingName={safeFirstName(shareId)} shareId={shareId} />;
}
