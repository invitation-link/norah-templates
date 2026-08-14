export type ProductOccasion = "BIRTHDAY" | "WEDDING" | "HOUSEWARMING" | "CELEBRATION" | "CORPORATE";

export type ProductTemplate = {
  id: string;
  name: string;
  occasion: ProductOccasion;
  occasionLabel: string;
  description: string;
  interaction: string;
  previewImage: string;
  liveUrl: string;
  editorUrl?: string;
  tier: "FREE" | "PREMIUM";
  source: "native" | "reference";
};

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: "digital-tiranga",
    name: "Digital Tiranga",
    occasion: "CELEBRATION",
    occasionLabel: "National celebration",
    description: "A quiet Independence Day ritual: raise the Tiranga by hand, stand with the anthem and pass it forward.",
    interaction: "Swipe to hoist the Tiranga",
    previewImage: "/tiranga/opengraph-image",
    liveUrl: "/tiranga",
    tier: "FREE",
    source: "native",
  },
  {
    id: "new-door",
    name: "The New Door",
    occasion: "HOUSEWARMING",
    occasionLabel: "Housewarming",
    description: "A warm cinematic welcome built around opening the door to a new beginning.",
    interaction: "Tap to open the door",
    previewImage: "/images/templates/live/norah-housewarming.png",
    liveUrl: "https://norah-housewarming.vercel.app/",
    editorUrl: "https://invite-platform-navy.vercel.app/",
    tier: "PREMIUM",
    source: "reference",
  },
  {
    id: "underwater-one",
    name: "Underwater One",
    occasion: "BIRTHDAY",
    occasionLabel: "Birthday",
    description: "A magical underwater first-birthday journey with a playful reveal.",
    interaction: "Dive into the celebration",
    previewImage: "/images/templates/live/underwater-one.png",
    liveUrl: "https://invite-platform-six.vercel.app/rudhrakshi",
    tier: "PREMIUM",
    source: "reference",
  },
  {
    id: "ganishka-original",
    name: "Golden Unboxing",
    occasion: "BIRTHDAY",
    occasionLabel: "Birthday",
    description: "A bright gift-box reveal followed by photos, countdown and party details.",
    interaction: "Tap the gift to reveal",
    previewImage: "/images/templates/live/ganishka-original.png",
    liveUrl: "/u/ganishka-original",
    editorUrl: "/editor/ganishka-original",
    tier: "PREMIUM",
    source: "native",
  },
  {
    id: "royal-wedding",
    name: "Royal Vows",
    occasion: "WEDDING",
    occasionLabel: "Wedding",
    description: "A grand palace-door opening with petals, ceremony details and RSVP.",
    interaction: "Enter through palace doors",
    previewImage: "/images/templates/live/royal-wedding.png",
    liveUrl: "/u/royal-wedding",
    editorUrl: "/editor/royal-wedding",
    tier: "PREMIUM",
    source: "native",
  },
  {
    id: "casual-party",
    name: "After Dark",
    occasion: "CELEBRATION",
    occasionLabel: "Celebration",
    description: "A high-energy scratch-to-reveal experience for parties and milestones.",
    interaction: "Scratch to reveal the plan",
    previewImage: "/images/templates/live/casual-party.png",
    liveUrl: "/u/casual-party",
    editorUrl: "/editor/casual-party",
    tier: "FREE",
    source: "native",
  },
  {
    id: "corporate-summit",
    name: "The Summit",
    occasion: "CORPORATE",
    occasionLabel: "Corporate",
    description: "A focused event hub with agenda, venue information and calendar action.",
    interaction: "Enter the event hub",
    previewImage: "/images/templates/live/corporate-summit.png",
    liveUrl: "/u/corporate-summit",
    editorUrl: "/editor/corporate-summit",
    tier: "PREMIUM",
    source: "native",
  },
];

export const getProductTemplate = (id: string) => PRODUCT_TEMPLATES.find((template) => template.id === id);
