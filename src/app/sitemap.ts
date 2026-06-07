import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.coveredwagonhauling.com";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/availability`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
