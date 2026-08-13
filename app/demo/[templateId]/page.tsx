import { getTemplateById, TEMPLATE_REGISTRY } from "@/app/components/templates/registry";
import { InviteData } from "@/app/components/templates/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ templateId: string }>;
}

// Generate metadata for each demo page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { templateId } = await params;
    const template = getTemplateById(templateId);
    return {
        title: template ? `${template.name} Demo | Invite Platform` : "Demo",
        description: template?.description || "Interactive invitation demo",
    };
}

// Generate static params for all templates
export function generateStaticParams() {
    return TEMPLATE_REGISTRY.map((template) => ({
        templateId: template.id,
    }));
}

// Mock data generators for each template type
const getMockData = (templateId: string): InviteData => {
    const baseData = {
        id: "demo-1",
        slug: `demo-${templateId}`,
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
                eventTitle: "Demo Event",
                hostName: "Demo Host",
                eventDate: new Date(Date.now() + 86400000 * 7).toISOString(),
                venueName: "Demo Venue",
                venueAddress: "Demo Address",
                rsvpLink: "#",
            };
    }
};

export default async function DemoPage({ params }: PageProps) {
    const { templateId } = await params;
    const template = getTemplateById(templateId);

    if (!template) {
        notFound();
    }

    const mockData = getMockData(templateId);
    const TemplateComponent = template.component;

    return (
        <div className="h-dvh w-full">
            <TemplateComponent data={mockData} mode="LIVE" />
        </div>
    );
}
