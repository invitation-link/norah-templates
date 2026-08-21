import { sitemapIndex, xmlResponse } from "@/app/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(sitemapIndex([
    "/sitemap-pages.xml",
    "/sitemap-templates.xml",
    "/sitemap-guides.xml",
  ]));
}
