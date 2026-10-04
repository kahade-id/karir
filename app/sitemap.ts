import type { MetadataRoute } from "next";
import { getPostings } from "@/lib/api";

const BASE = "https://karir.kahade.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];
  try {
    const postings = await getPostings();
    slugs = postings.map((p) => p.slug);
  } catch {
    slugs = [];
  }

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/privasi-pelamar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...slugs.map((slug) => ({
      url: `${BASE}/lowongan/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
