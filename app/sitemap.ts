import type { MetadataRoute } from "next";

import { APP_SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: APP_SITE_URL, changeFrequency: "daily", priority: 1 }];
}
