export type TirangaStage =
  | "intro"
  | "ready"
  | "hoisting"
  | "unfurling"
  | "anthem"
  | "pride"
  | "personalization"
  | "share"
  | "conversion";

export type TirangaCommunity = {
  slug: string;
  name: string;
  label: string;
  memberLabel: string;
};

export type TirangaStats = {
  nationalCount: number;
  cities: Array<{ city: string; count: number; x: number; y: number }>;
};

export const TIRANGA_BASELINE_COUNT = 0;

export const DEFAULT_TIRANGA_STATS: TirangaStats = {
  nationalCount: TIRANGA_BASELINE_COUNT,
  cities: [],
};

export function safeFirstName(value: string | undefined) {
  if (!value) return "Someone";
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Keep the original route segment when it contains malformed escapes.
  }
  const firstName = decoded.split("-")[0].replace(/[^\p{L}]/gu, "");
  if (!firstName) return "Someone";
  return firstName.charAt(0).toUpperCase() + firstName.slice(1, 28).toLowerCase();
}

export function createShareSlug(name: string) {
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tiranga";
  return `${base}-${crypto.randomUUID().slice(0, 5)}`;
}

export function communityFromSlug(slug: string): TirangaCommunity {
  const name = slug.split("-").filter(Boolean).map((part) => part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)).join(" ") || "Our Community";
  return { slug, name, label: "Digital Flag Hoisting", memberLabel: "community members" };
}
