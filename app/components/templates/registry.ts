import { InviteData, TemplateProps } from "./types";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

export type TemplateCategory = "BIRTHDAY" | "WEDDING" | "HOUSEWARMING" | "CORPORATE" | "CASUAL";

export interface TemplateMetadata {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    tier: "FREE" | "PREMIUM";
    thumbnailUrl: string; // Path to preview image
    component: ComponentType<TemplateProps>; // Dynamic import
}

// 1. The Registry
export const TEMPLATE_REGISTRY: TemplateMetadata[] = [
    {
        id: "new-door",
        name: "The New Door",
        description: "A warm housewarming reveal built around opening the door to a new beginning.",
        category: "HOUSEWARMING",
        tier: "PREMIUM",
        thumbnailUrl: "/images/templates/live/norah-housewarming.png",
        component: dynamic(() => import("./new-door")),
    },
    {
        id: "underwater-one",
        name: "Underwater One",
        description: "A playful undersea first-birthday reveal filled with bubbles and wonder.",
        category: "BIRTHDAY",
        tier: "PREMIUM",
        thumbnailUrl: "/images/templates/live/underwater-one.png",
        component: dynamic(() => import("./underwater-one")),
    },
    {
        id: "ganishka-original",
        name: "Golden Unboxing",
        description: "The viral birthday classic with gift box reveal and candle blowing.",
        category: "BIRTHDAY",
        tier: "PREMIUM",
        thumbnailUrl: "/images/templates/live/ganishka-original.png",
        component: dynamic(() => import("./ganishka-original")),
    },
    {
        id: "royal-wedding",
        name: "Royal Palace",
        description: "An elegant wedding invite featuring a grand door reveal and rose petal shower.",
        category: "WEDDING",
        tier: "PREMIUM",
        thumbnailUrl: "/images/templates/live/royal-wedding.png",
        component: dynamic(() => import("./royal-wedding")),
    },
    {
        id: "corporate-summit",
        name: "The Summit",
        description: "Professional event hub with agenda view and calendar sync.",
        category: "CORPORATE",
        tier: "PREMIUM",
        thumbnailUrl: "/images/templates/live/corporate-summit.png",
        component: dynamic(() => import("./corporate-summit")),
    },
    {
        id: "casual-party",
        name: "Neon Party",
        description: "Fun tap-to-reveal scratch card style for house parties.",
        category: "CASUAL",
        tier: "FREE",
        thumbnailUrl: "/images/templates/live/casual-party.png",
        component: dynamic(() => import("./casual-party")),
    },
];

// 2. Helper to get template
export const getTemplateById = (id: string) => {
    return TEMPLATE_REGISTRY.find((t) => t.id === id);
};

// 3. Helper to filter by category
export const getTemplatesByCategory = (category: TemplateCategory) => {
    return TEMPLATE_REGISTRY.filter((t) => t.category === category);
};
