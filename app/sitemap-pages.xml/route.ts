import { publicPageRoutes } from "@/app/lib/seo-routes";
import { urlSet, xmlResponse } from "@/app/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(urlSet(publicPageRoutes));
}
