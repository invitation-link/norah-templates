export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://www.invitelink.shop").replace(/\/$/, "");

export const SITE_NAME = "Invite Link";
export const SITE_DESCRIPTION = "Create beautiful interactive invitations for weddings, birthdays, housewarmings, celebrations and festivals. Customize a template and share one simple invitation link on WhatsApp.";

export const publicTemplateIds = ["ganishka-original", "royal-wedding", "corporate-summit", "casual-party"] as const;
