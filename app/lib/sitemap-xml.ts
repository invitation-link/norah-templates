import { SITE_URL } from "./site";
import type { SitemapEntry } from "./seo-routes";

const LAST_MODIFIED = "2026-08-21";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] || character);
}

function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function sitemapIndex(paths: string[]) {
  const items = paths.map((path) => `<sitemap><loc>${escapeXml(absoluteUrl(path))}</loc><lastmod>${LAST_MODIFIED}</lastmod></sitemap>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}

export function urlSet(entries: SitemapEntry[]) {
  const usesImages = entries.some((entry) => entry.image);
  const items = entries.map((entry) => {
    const image = entry.image ? `<image:image><image:loc>${escapeXml(absoluteUrl(entry.image))}</image:loc></image:image>` : "";
    return `<url><loc>${escapeXml(absoluteUrl(entry.path))}</loc><lastmod>${LAST_MODIFIED}</lastmod>${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ""}${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ""}${image}</url>`;
  }).join("");
  const imageNamespace = usesImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : "";
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNamespace}>${items}</urlset>`;
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
