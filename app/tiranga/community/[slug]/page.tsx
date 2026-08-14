import type { Metadata } from "next";
import TirangaExperience from "@/app/components/tiranga/TirangaExperience";
import { SITE_URL } from "@/app/lib/site";
import { communityFromSlug } from "@/app/lib/tiranga";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = communityFromSlug(slug);
  return {
    title: `${community.name} Digital Flag Hoisting`,
    description: `Join ${community.name} for an interactive Digital Tiranga ceremony, powered by Invite Link.`,
    alternates: { canonical: `${SITE_URL}/tiranga/community/${slug}` },
    openGraph: { title: `${community.name} — Digital Flag Hoisting`, description: `Hoist the Tiranga with ${community.name}.`, images: [`${SITE_URL}/tiranga/opengraph-image`] },
  };
}

export default async function TirangaCommunityPage({ params }: PageProps) {
  const { slug } = await params;
  return <TirangaExperience community={communityFromSlug(slug)} />;
}
