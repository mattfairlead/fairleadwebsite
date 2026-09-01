import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getEngagements, getPerspectives } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [engagements, posts] = await Promise.all([getEngagements(), getPerspectives("perspective")]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/platform",
    "/intelligence",
    "/engagements",
    "/team",
    "/perspectives",
    "/contact",
    "/careers",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...engagements
      .filter((e) => e.body_md)
      .map((e) => ({ url: `${SITE_URL}/engagements/${e.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts
      .filter((p) => p.body_md)
      .map((p) => ({ url: `${SITE_URL}/perspectives/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
