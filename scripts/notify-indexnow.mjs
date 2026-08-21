const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.invitelink.shop").replace(/\/$/, "");
const host = new URL(siteUrl).host;
const key = process.env.INDEXNOW_KEY || "ed2c1c4dbf334dc2865d54075e00f4b1";
const routes = [
  "",
  "/templates",
  "/pricing",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/refund",
  "/tiranga",
  "/occasions/birthday",
  "/occasions/wedding",
  "/occasions/housewarming",
  "/occasions/celebrations",
  "/occasions/baby-shower",
  "/occasions/engagement",
  "/occasions/naming-ceremony",
  "/occasions/corporate",
  "/templates/digital-tiranga",
  "/templates/new-door",
  "/templates/underwater-one",
  "/templates/ganishka-original",
  "/templates/royal-wedding",
  "/templates/casual-party",
  "/templates/corporate-summit",
];
const urlList = routes.map((route) => `${siteUrl}${route}`);

const payload = {
  host,
  key,
  keyLocation: `${siteUrl}/indexnow-key.txt`,
  urlList,
};

if (process.argv.includes("--dry-run")) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (!response.ok && response.status !== 202) {
  throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
}

console.log(`IndexNow accepted ${urlList.length} URLs with status ${response.status}.`);
