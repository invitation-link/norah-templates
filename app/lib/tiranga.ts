export type TirangaStage =
  | "intro"
  | "ready"
  | "hoisting"
  | "unfurling"
  | "pride"
  | "personalization"
  | "chain"
  | "share"
  | "map"
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

export const TIRANGA_BASELINE_COUNT = 48721;

export const DEFAULT_TIRANGA_STATS: TirangaStats = {
  nationalCount: TIRANGA_BASELINE_COUNT,
  cities: [
    { city: "Delhi", count: 3620, x: 128, y: 78 },
    { city: "Jaipur", count: 1840, x: 94, y: 117 },
    { city: "Ahmedabad", count: 2110, x: 67, y: 153 },
    { city: "Mumbai", count: 3940, x: 87, y: 215 },
    { city: "Hyderabad", count: 3290, x: 139, y: 224 },
    { city: "Bengaluru", count: 2860, x: 137, y: 278 },
    { city: "Chennai", count: 2460, x: 166, y: 296 },
    { city: "Kolkata", count: 2750, x: 212, y: 177 },
    { city: "Guwahati", count: 1120, x: 249, y: 117 },
    { city: "Srinagar", count: 760, x: 111, y: 36 },
  ],
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
