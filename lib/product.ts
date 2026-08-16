import { z } from "zod";

export const planIds = ["FREE_AD_SUPPORTED", "ESSENTIAL", "PREMIUM"] as const;
export type PlanId = (typeof planIds)[number];

export const invitationStatuses = ["DRAFT", "PAYMENT_PENDING", "PUBLISHED", "ARCHIVED"] as const;
export type InvitationStatus = (typeof invitationStatuses)[number];

export const PRICING = {
  FREE_AD_SUPPORTED: {
    id: "FREE_AD_SUPPORTED" as const,
    name: "Free",
    amount: 0,
    description: "A beautiful basic invitation with Invite Link credit and one end-of-invite sponsor.",
  },
  ESSENTIAL: {
    id: "ESSENTIAL" as const,
    name: "Essential",
    amount: 399,
    description: "Full standard-template customization, a custom slug and no third-party ads.",
  },
  PREMIUM: {
    id: "PREMIUM" as const,
    name: "Premium",
    amount: 999,
    description: "Premium interactions, gallery, music, analytics and no Invite Link branding.",
  },
} satisfies Record<PlanId, { id: PlanId; name: string; amount: number; description: string }>;

const safeUrl = z.union([z.literal(""), z.string().url()]).optional();

export const invitationContentSchema = z.object({
  type: z.enum(["BIRTHDAY", "WEDDING", "HOUSEWARMING", "CORPORATE", "CASUAL"]),
  eventTitle: z.string().trim().min(2).max(100),
  hostName: z.string().trim().min(2).max(120),
  coHostName: z.string().trim().max(120).optional().default(""),
  familyName: z.string().trim().max(160).optional().default(""),
  eventDate: z.string().min(8).max(40),
  venueName: z.string().trim().min(2).max(160),
  venueAddress: z.string().trim().min(2).max(300),
  venueMapUrl: safeUrl.default(""),
  coverImage: z.string().max(2_000_000).default(""),
  galleryImages: z.array(z.string().max(2_000_000)).max(12).default([]),
  musicUrl: safeUrl.default(""),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default("#E6A719"),
  fontFamily: z.enum(["Classic", "Modern", "Elegant"]).optional().default("Classic"),
  themeVariant: z.enum(["IVORY", "MIDNIGHT", "ROSE", "TRADITIONAL"]).optional().default("IVORY"),
  language: z.enum(["English", "Hindi", "Telugu"]).optional().default("English"),
  message: z.string().trim().max(1_000).optional().default(""),
  openingLine: z.string().trim().max(240).optional().default(""),
  quote: z.string().trim().max(500).optional().default(""),
  closingMessage: z.string().trim().max(500).optional().default(""),
  rsvpLink: safeUrl.default(""),
  rsvpPhone: z.string().trim().max(20).optional().default(""),
});

export type InvitationContent = z.infer<typeof invitationContentSchema>;

export const FREE_TEMPLATE_IDS = ["casual-party"] as const;
const defaultCoverByTemplate: Record<string, string> = {
  "casual-party": "/images/templates/live/casual-party.png",
  "ganishka-original": "/images/templates/live/ganishka-original.png",
  "royal-wedding": "/images/templates/live/royal-wedding.png",
  "new-door": "/images/templates/live/norah-housewarming.png",
  "underwater-one": "/images/templates/live/underwater-one.png",
  "corporate-summit": "/images/templates/live/corporate-summit.png",
};

export function contentForPlan(content: InvitationContent, planId: PlanId, templateId: string): InvitationContent {
  if (planId === "PREMIUM") return content;
  if (planId === "ESSENTIAL") return { ...content, galleryImages: [], musicUrl: "" };
  return {
    ...content,
    coHostName: "",
    familyName: "",
    openingLine: "",
    quote: "",
    closingMessage: "",
    coverImage: defaultCoverByTemplate[templateId] || "",
    galleryImages: [],
    musicUrl: "",
    primaryColor: "#E6A719",
    fontFamily: "Classic",
    themeVariant: "IVORY",
    language: "English",
  };
}

export const invitationInputSchema = z.object({
  id: z.string().uuid().optional(),
  templateId: z.string().regex(/^[a-z0-9-]{2,80}$/),
  slug: z.string().regex(/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])?$/).optional(),
  planId: z.enum(planIds).default("FREE_AD_SUPPORTED"),
  content: invitationContentSchema,
});

export const rsvpInputSchema = z.object({
  guestName: z.string().trim().min(2).max(100),
  guestPhone: z.string().trim().max(20).optional().default(""),
  guestEmail: z.union([z.literal(""), z.string().email()]).optional().default(""),
  attending: z.boolean(),
  guestsCount: z.coerce.number().int().min(0).max(20).default(1),
  message: z.string().trim().max(500).optional().default(""),
});

export const bespokeRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  phone: z.string().trim().min(8).max(20),
  occasion: z.string().trim().min(2).max(80),
  eventDate: z.string().max(40).optional().default(""),
  brief: z.string().trim().min(20).max(2_000),
});

export function publicInvitation(row: Record<string, unknown>) {
  return {
    id: row.id,
    slug: row.slug,
    templateId: row.template_id,
    planId: row.plan_id,
    status: row.status,
    content: row.content,
    publishedAt: row.published_at,
  };
}
