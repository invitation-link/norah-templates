import { contentForPlan, invitationInputSchema, PRICING } from "../lib/product";

const content = {
  type: "BIRTHDAY" as const,
  eventTitle: "Aarav turns one",
  hostName: "The Mehta family",
  eventDate: "2026-08-22T18:30",
  venueName: "The Courtyard",
  venueAddress: "12 Garden Road, Bengaluru",
  venueMapUrl: "https://maps.google.com",
  coverImage: "https://example.com/custom.webp",
  galleryImages: ["https://example.com/one.webp"],
  musicUrl: "https://example.com/music.mp3",
  message: "Come celebrate with us.",
};

describe("production product rules", () => {
  it("locks launch pricing", () => {
    expect(PRICING.ESSENTIAL.amount).toBe(399);
    expect(PRICING.PREMIUM.amount).toBe(999);
  });

  it("accepts a valid invitation payload", () => {
    expect(invitationInputSchema.safeParse({ templateId: "casual-party", slug: "aarav-turns-one", planId: "FREE_AD_SUPPORTED", content }).success).toBe(true);
  });

  it("removes premium media from free invitations", () => {
    const parsed = invitationInputSchema.parse({ templateId: "casual-party", planId: "FREE_AD_SUPPORTED", content });
    const free = contentForPlan(parsed.content, "FREE_AD_SUPPORTED", "casual-party");
    expect(free.galleryImages).toEqual([]);
    expect(free.musicUrl).toBe("");
    expect(free.coverImage).toBe("/images/templates/live/casual-party.png");
  });

  it("reserves gallery and music for Premium", () => {
    const parsed = invitationInputSchema.parse({ templateId: "new-door", planId: "ESSENTIAL", content });
    const essential = contentForPlan(parsed.content, "ESSENTIAL", "new-door");
    expect(essential.coverImage).toBe("https://example.com/custom.webp");
    expect(essential.galleryImages).toEqual([]);
    expect(essential.musicUrl).toBe("");
  });
});
