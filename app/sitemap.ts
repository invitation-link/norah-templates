import { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";
import { PRODUCT_TEMPLATES } from "./lib/product-templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-14");
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/templates", priority: .9, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: .85, changeFrequency: "monthly" as const },
    { path: "/about", priority: .7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: .6, changeFrequency: "monthly" as const },
    { path: "/faq", priority: .7, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: .3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: .3, changeFrequency: "yearly" as const },
    { path: "/refund", priority: .3, changeFrequency: "yearly" as const },
    { path: "/tiranga", priority: .9, changeFrequency: "weekly" as const },
    { path: "/occasions/birthday", priority: .85, changeFrequency: "monthly" as const },
    { path: "/occasions/wedding", priority: .85, changeFrequency: "monthly" as const },
    { path: "/occasions/housewarming", priority: .85, changeFrequency: "monthly" as const },
    { path: "/occasions/celebrations", priority: .8, changeFrequency: "monthly" as const },
    { path: "/occasions/baby-shower", priority: .8, changeFrequency: "monthly" as const },
    { path: "/occasions/engagement", priority: .8, changeFrequency: "monthly" as const },
    { path: "/occasions/naming-ceremony", priority: .8, changeFrequency: "monthly" as const },
    { path: "/occasions/corporate", priority: .75, changeFrequency: "monthly" as const },
  ];
  const templates = PRODUCT_TEMPLATES.map(({ id }) => ({ path: `/templates/${id}`, priority: .8, changeFrequency: "monthly" as const }));
  return [...pages, ...templates].map(({ path, priority, changeFrequency }) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority }));
}
