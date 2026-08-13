// The "Configuration" every template must accept
export interface InviteData {
  id: string;
  slug: string;
  type: "BIRTHDAY" | "WEDDING" | "CORPORATE" | "CASUAL";
  tier: "FREE" | "PREMIUM";
  
  // Core Details
  eventTitle: string;
  hostName: string;
  coHostName?: string;
  familyName?: string;
  eventDate: string; // ISO String
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;

  // Media
  coverImage: string; // The "Envelope" or "Gift Box" image
  galleryImages: string[]; // For the carousel
  musicUrl?: string; // Optional background music

  // Customization
  primaryColor?: string; // e.g. "#ff9a9e"
  fontFamily?: string;
  themeVariant?: "IVORY" | "MIDNIGHT" | "ROSE" | "TRADITIONAL";
  language?: "English" | "Hindi" | "Telugu";
  
  // Content
  message?: string; // "Join us for..."
  openingLine?: string;
  quote?: string;
  closingMessage?: string;
  rsvpLink?: string; // Or internal handler
  rsvpPhone?: string;
}

// The "Props" the Template Component receives
export interface TemplateProps {
  data: InviteData;
  mode: "PREVIEW" | "LIVE"; // Preview allows editing, Live is read-only
  onInteraction?: (type: string, value?: unknown) => void; // Analytics hook
}

// Registry of available templates
export type TemplateId = "ganishka-original" | "royal-wedding" | "office-party";
