export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://invite-link-rosy.vercel.app").replace(/\/$/, "");

export const SITE_NAME = "Invite Link";
export const SITE_DESCRIPTION = "Create interactive digital invitations for weddings, birthdays, housewarmings and celebrations. Personalize the details, publish one link and share it on WhatsApp.";

export const publicTemplateIds = ["ganishka-original", "royal-wedding", "corporate-summit", "casual-party"] as const;
