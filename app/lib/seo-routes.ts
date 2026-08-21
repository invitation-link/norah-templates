import { PRODUCT_TEMPLATES } from "./product-templates";

export type SitemapEntry = {
  path: string;
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
  image?: string;
};

export const publicPageRoutes: SitemapEntry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/templates", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.85, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
  { path: "/tiranga", priority: 0.9, changeFrequency: "weekly" },
  { path: "/occasions/birthday", priority: 0.85, changeFrequency: "monthly" },
  { path: "/occasions/wedding", priority: 0.85, changeFrequency: "monthly" },
  { path: "/occasions/housewarming", priority: 0.85, changeFrequency: "monthly" },
  { path: "/occasions/celebrations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/occasions/baby-shower", priority: 0.8, changeFrequency: "monthly" },
  { path: "/occasions/engagement", priority: 0.8, changeFrequency: "monthly" },
  { path: "/occasions/naming-ceremony", priority: 0.8, changeFrequency: "monthly" },
  { path: "/occasions/corporate", priority: 0.75, changeFrequency: "monthly" },
];

export const publicTemplateRoutes: SitemapEntry[] = PRODUCT_TEMPLATES.map((template) => ({
  path: `/templates/${template.id}`,
  priority: 0.8,
  changeFrequency: "monthly",
  image: template.previewImage,
}));

// Visible guide articles are intentionally held until their copy and layout are approved.
export const publicGuideRoutes: SitemapEntry[] = [];
