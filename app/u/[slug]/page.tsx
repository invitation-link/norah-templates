import { getTemplateById } from "@/app/components/templates/registry";
import { InviteData } from "@/app/components/templates/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/app/lib/site";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return [
        { slug: 'ganishka-original' },
        { slug: 'royal-wedding' },
        { slug: 'corporate-summit' },
        { slug: 'casual-party' },
        { slug: 'demo' },
    ];
}

// Dynamic Open Graph metadata for social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    // Check if it's a template demo
    const template = getTemplateById(slug);
    if (template) {
        return {
            title: `${template.name} Interactive Invitation Template`,
            description: template.description,
            alternates: { canonical: `${SITE_URL}/templates/${slug}` },
            robots: { index: false, follow: true, noarchive: true },
            openGraph: {
                type: "website",
                url: `${SITE_URL}/templates/${slug}`,
                siteName: "Invite Link",
                title: `${template.name} Interactive Invitation Template`,
                description: template.description,
                images: [{ url: template.thumbnailUrl, width: 390, height: 844, alt: `${template.name} opening screen` }],
            },
            twitter: { card: "summary_large_image", title: `${template.name} | Invite Link`, description: template.description, images: [template.thumbnailUrl] },
        };
    }

    return {
        title: "You're Invited",
        description: "Open this interactive invitation to see a special message!",
        robots: { index: false, follow: false },
        openGraph: {
            type: "website",
            title: "You're Invited",
            description: "Tap to open your special interactive invitation.",
            images: [
                {
                    url: "/images/templates/birthday-thumb.png",
                    width: 1200,
                    height: 630,
                    alt: "Interactive Invitation Preview",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "You're Invited",
            description: "Tap to open your special interactive invitation.",
            images: ["/images/templates/birthday-thumb.png"],
        },
    };
}

// Mock data generators for each template type
const getMockData = (templateId: string, slug: string): InviteData => {
    const baseData = {
        id: "demo-1",
        slug: slug,
        tier: "PREMIUM" as const,
        venueMapUrl: "https://maps.google.com",
        coverImage: "",
        galleryImages: [
            "/images/WhatsApp Image 2025-12-31 at 8.37.16 PM.jpeg",
            "/images/WhatsApp Image 2025-12-31 at 8.37.16 PM (1).jpeg",
            "/images/WhatsApp Image 2026-01-01 at 12.41.31 AM.jpeg"
        ],
        musicUrl: "/music/birthday-music.mp3"
    };

    switch (templateId) {
        case "ganishka-original":
            return {
                ...baseData,
                type: "BIRTHDAY",
                eventTitle: "Ganishka Turns One",
                hostName: "Parents",
                eventDate: new Date(Date.now() + 86400000 * 4).toISOString(),
                venueName: "Manikonda Community Hall",
                venueAddress: "Near Marrichettu, Hyderabad",
                rsvpLink: "https://wa.me/917337350849",
            };

        case "royal-wedding":
            return {
                ...baseData,
                type: "WEDDING",
                eventTitle: "Priya & Arjun's Wedding",
                hostName: "The Sharma & Reddy Families",
                eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
                venueName: "Taj Falaknuma Palace",
                venueAddress: "Engine Bowli, Falaknuma, Hyderabad",
                rsvpLink: "https://wa.me/919876543210",
                message: "Two souls, one heart. Join us as we begin our forever.",
                primaryColor: "#D4AF37",
            };

        case "corporate-summit":
            return {
                ...baseData,
                type: "CORPORATE",
                eventTitle: "Tech Innovation Summit 2026",
                hostName: "TechCorp Industries",
                eventDate: new Date(Date.now() + 86400000 * 14).toISOString(),
                venueName: "HICC Convention Centre",
                venueAddress: "Madhapur, Hyderabad",
                rsvpLink: "https://forms.google.com",
                message: "Join industry leaders for a day of innovation and networking.",
                primaryColor: "#1E3A8A",
            };

        case "casual-party":
            return {
                ...baseData,
                type: "CASUAL",
                tier: "FREE",
                eventTitle: "New Year House Party 🎉",
                hostName: "Raj & Friends",
                eventDate: new Date(Date.now() + 86400000 * 7).toISOString(),
                venueName: "Raj's Penthouse",
                venueAddress: "Jubilee Hills, Hyderabad",
                rsvpLink: "https://wa.me/919988776655",
                message: "BYOB! Let's bring in 2026 with style!",
                primaryColor: "#FF00FF",
            };

        default:
            return {
                ...baseData,
                type: "BIRTHDAY",
                eventTitle: "Ganishka Turns One",
                hostName: "Parents",
                eventDate: new Date(Date.now() + 86400000 * 4).toISOString(),
                venueName: "Manikonda Community Hall",
                venueAddress: "Near Marrichettu, Hyderabad",
                rsvpLink: "https://wa.me/917337350849",
            };
    }
};

export default async function Page({ params }: PageProps) {
    const { slug = "demo" } = await params;

    // Check if the slug matches a template ID for demos
    const template = getTemplateById(slug);

    if (template) {
        // Render the specific template for demo/testing
        const mockData = getMockData(slug, slug);
        const TemplateComponent = template.component;

        return (
            <div className="h-dvh w-full">
                <TemplateComponent data={mockData} mode="LIVE" />
            </div>
        );
    }

    // Default: Use the ganishka-original template for any other slug
    const defaultTemplate = getTemplateById("ganishka-original");
    if (!defaultTemplate) {
        notFound();
    }

    const mockData = getMockData("ganishka-original", slug);
    const TemplateComponent = defaultTemplate.component;

    return (
        <div className="h-dvh w-full">
            <TemplateComponent data={mockData} mode="LIVE" />
        </div>
    );
}
