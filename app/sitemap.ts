import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { locales } from "@/lib/locales";
import { publicSiteUrl } from "@/lib/seo";
import { tests } from "@/lib/tests";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/tests", "/guides", "/about", "/contact", "/privacy", "/terms"];
  return locales.flatMap((locale) => [
    ...staticPaths.map((path) => ({
      url: `${publicSiteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...tests.map((test) => ({
      url: `${publicSiteUrl}/${locale}/tests/${test.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...guides.map((guide) => ({
      url: `${publicSiteUrl}/${locale}/guides/${guide.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ]);
}
