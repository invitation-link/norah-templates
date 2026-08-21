import type { Metadata, Viewport } from "next";
import { Great_Vibes, Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsConsent from "./components/analytics/AnalyticsConsent";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import MicrosoftClarity from "./components/analytics/MicrosoftClarity";
import { AuthProvider } from "./components/providers/AuthProvider";
import SmoothScroll from "./components/providers/SmoothScroll";
import JsonLd, { schemas } from "./components/seo/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Interactive Invitation Links for Every Occasion | Invite Link", template: "%s | Invite Link" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "interactive digital invitation", "online invitation maker", "WhatsApp invitation",
    "digital wedding invitation India", "birthday invitation maker", "housewarming invitation online",
    "griha pravesh invitation", "baby shower invitation", "wedding e invite", "RSVP invitation link",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Digital Invitations",
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, noimageindex: false, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/brand/invite-link-mark.png", apple: "/brand/invite-link-mark.png" },
  manifest: "/manifest.webmanifest",
  verification: { google: "zmhEQSNhOqwPCoXEHraIkf_yloiE9WsmfocctZ-z2ZQ" },
  openGraph: {
    type: "website", locale: "en_IN", url: SITE_URL, siteName: SITE_NAME,
    title: "Invite Link — Don't Just Send an Invitation. Make Them Feel Invited.",
    description: "Choose a beautifully choreographed invitation, personalize it and share one unforgettable link on WhatsApp.",
    images: [{ url: "/images/invite-link-og.png", width: 1200, height: 630, alt: "Invite Link interactive digital invitation maker", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image", title: "Invite Link — Interactive Invitations Made to Be Felt",
    description: "Choose, personalize and share a beautifully choreographed invitation experience.", images: ["/images/invite-link-og.png"],
  },
  alternates: { canonical: SITE_URL },
  other: { "apple-mobile-web-app-capable": "yes", "apple-mobile-web-app-status-bar-style": "black-translucent" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071A38", colorScheme: "light", interactiveWidget: "resizes-content" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = [
    schemas.webSite(SITE_URL),
    schemas.organization(SITE_URL),
  ];
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  return (
    <html lang="en-IN">
      <head><link rel="dns-prefetch" href="https://www.googletagmanager.com" /><link rel="dns-prefetch" href="https://www.clarity.ms" /></head>
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} antialiased font-sans`}>
        <JsonLd data={schema} />
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        {clarityId && <MicrosoftClarity projectId={clarityId} />}
        {(gaId || clarityId) && <AnalyticsConsent />}
        <AuthProvider><SmoothScroll>{children}<Toaster position="top-center" richColors /></SmoothScroll></AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
