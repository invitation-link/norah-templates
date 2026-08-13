import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/providers/SmoothScroll";
import { AuthProvider } from "./components/providers/AuthProvider";
import { Toaster } from "sonner";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import MicrosoftClarity from "./components/analytics/MicrosoftClarity";
import JsonLd, { schemas } from "./components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script" });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://invite-platform-navy.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  // Primary SEO
  title: {
    default: "Invite Link — Interactive Invitations Made to Be Felt",
    template: "%s | Invite Link",
  },
  description: "Choose a beautifully designed interactive invitation, personalize your occasion, publish one link and share it instantly on WhatsApp.",

  // Keywords for search engines
  keywords: [
    "digital invitation",
    "online invitation maker",
    "free invitation maker",
    "digital wedding invitation",
    "birthday e-invite",
    "WhatsApp invitation",
    "digital invitation India",
    "housewarming invitation online",
    "griha pravesh invitation",
    "baby shower e-invite",
    "corporate event invitation",
    "interactive invitation",
    "RSVP invitation",
    "wedding card online",
    "birthday invitation card maker",
    "free digital invitation templates",
    "shaadi invitation online",
    "mundan invitation card",
    "haldi invitation",
    "sangeet invitation",
  ],

  // Authors and Publisher
  authors: [{ name: "Invite Link" }],
  creator: "Invite Link",
  publisher: "Invite Link",

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/brand/invite-link-mark.png",
    apple: "/brand/invite-link-mark.png",
  },

  // Category
  category: "Technology",

  // Verification codes
  verification: {
    google: "zmhEQSNhOqwPCoXEHraIkf_yloiE9WsmfocctZ-z2ZQ",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US", "hi_IN"],
    url: baseUrl,
    siteName: "Invite Link",
    title: "Invite Link — Don't Just Send an Invitation. Make Them Feel Invited.",
    description: "Beautifully choreographed invitation experiences you can personalize, publish and share in one link.",
    images: [
      {
        url: "/images/invite-link-og.png",
        width: 1200,
        height: 630,
        alt: "Invite Link — Interactive invitations made to be felt",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@invitationlink",
    creator: "@invitationlink",
    title: "Invite Link — Interactive Invitations Made to Be Felt",
    description: "Choose, personalize and share a beautifully choreographed invitation experience.",
    images: ["/images/invite-link-og.png"],
  },

  // Alternate languages
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-IN": baseUrl,
      "en-US": baseUrl,
    },
  },

  // App links
  appLinks: {
    web: {
      url: baseUrl,
      should_fallback: true,
    },
  },

  // Other metadata
  other: {
    "google-site-verification": "zmhEQSNhOqwPCoXEHraIkf_yloiE9WsmfocctZ-z2ZQ",
    "theme-color": "#071A38",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Combined schema for homepage
  const combinedSchema = [
    schemas.webSite(baseUrl),
    schemas.organization(baseUrl),
    schemas.softwareApplication(baseUrl),
  ];

  return (
    <html lang="en">
      <head>
        {/* Preconnect to important third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} antialiased font-sans`}>
        {/* Structured Data */}
        <JsonLd data={combinedSchema} />

        {/* Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <MicrosoftClarity projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID} />
        )}

        <AuthProvider>
          <SmoothScroll>
            {children}
            <Toaster position="top-center" richColors />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
