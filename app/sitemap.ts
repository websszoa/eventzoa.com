import type { MetadataRoute } from "next";

import { APP_SITE_URL } from "@/lib/constants";
import events from "@/data/events/events_2026.json";
import { getNotificationPosts } from "@/lib/notifications";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { path: "", changeFrequency: "daily" as const, priority: 1 },
    { path: "/festivals", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/list", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/calendar", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/map", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/notifications", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.2 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.2 },
    { path: "/policy", changeFrequency: "yearly" as const, priority: 0.2 },
  ].map(({ path, ...entry }) => ({
    url: `${APP_SITE_URL}${path}`,
    ...entry,
  }));
  const festivalPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${APP_SITE_URL}/festivals/${event.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    images: [`${APP_SITE_URL}/event/cover/${event.slug}.jpg`],
  }));
  const posts = await getNotificationPosts();
  const notificationPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${APP_SITE_URL}/notifications?category=${post.category}&post=${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...festivalPages, ...notificationPages];
}
