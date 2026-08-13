import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Invitation Templates",
  description: "Preview the exact opening experience for every Invite Link template, then personalize and publish one shareable invitation link.",
  openGraph: {
    title: "Interactive Invitation Templates | Invite Link",
    description: "Choose a feeling, experience the real template and make it yours.",
    images: ["/images/invite-link-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitation Templates | Invite Link",
    description: "Real interactive invitation experiences for weddings, birthdays, housewarmings and celebrations.",
    images: ["/images/invite-link-og.png"],
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
