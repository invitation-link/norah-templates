import { MetadataRoute } from "next";
import { publicTemplateIds, SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-13");
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/templates", priority: .9, changeFrequency: "weekly" as const },
    { path: "/about", priority: .7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: .7, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: .3, changeFrequency: "yearly" as const },
    { path: "/occasions/birthday", priority: .85, changeFrequency: "monthly" as const },
    { path: "/occasions/wedding", priority: .85, changeFrequency: "monthly" as const },
    { path: "/occasions/housewarming", priority: .85, changeFrequency: "monthly" as const },
    { path: "/occasions/celebrations", priority: .8, changeFrequency: "monthly" as const },
  ];
  const templates = publicTemplateIds.map((id) => ({ path: `/u/${id}`, priority: .8, changeFrequency: "monthly" as const }));
  return [...pages, ...templates].map(({ path, priority, changeFrequency }) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority }));
}
