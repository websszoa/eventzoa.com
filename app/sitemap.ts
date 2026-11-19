import type { MetadataRoute } from "next";

import { APP_SITE_URL } from "@/lib/constants";
import { getEventCoverPath } from "@/lib/event-image.server";
import { uniqueFestivals } from "@/lib/festival-data.server";
import {
  getNotificationPostPath,
  getNotificationPosts,
} from "@/lib/notifications";

// Next.js는 sitemap URL의 &를 이스케이프하지 않아 XML이 깨진다.
function escapeXml(url: string) {
  return url.replaceAll("&", "&amp;");
}

function latest(dates: (string | undefined)[]) {
  return dates.filter(Boolean).sort().at(-1);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getNotificationPosts();
  const postsLastmod = (categories: string[]) =>
    latest(
      posts
        .filter((post) => categories.includes(post.category))
        .map((post) => post.publishedAt),
    );
  // 정확한 날짜를 알 수 있는 글 목록 페이지에만 lastModified를 넣는다.
  const staticPages = [
    {
      path: "",
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      path: "/festivals",
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      path: "/list",
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      path: "/calendar",
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      path: "/map",
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      path: "/notifications",
      changeFrequency: "weekly" as const,
      priority: 0.7,
      lastModified: postsLastmod(["notice", "update"]),
    },
    {
      path: "/blog",
      changeFrequency: "weekly" as const,
      priority: 0.8,
      lastModified: postsLastmod(["festival"]),
    },
    {
      path: "/newsletter",
      changeFrequency: "weekly" as const,
      priority: 0.7,
      lastModified: postsLastmod(["newsletter"]),
    },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.2 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.2 },
    { path: "/policy", changeFrequency: "yearly" as const, priority: 0.2 },
  ].map(({ path, lastModified, ...entry }) => ({
    url: `${APP_SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
    ...entry,
  }));
  const festivalPages: MetadataRoute.Sitemap = uniqueFestivals.map((event) => {
    // 실제 존재하는 커버 파일(webp/jpg/png)만 넣는다. 캐시용 ?v= 쿼리는 뺀다.
    const coverImage = getEventCoverPath(event.slug)?.split("?")[0];

    return {
      url: `${APP_SITE_URL}/festivals/${event.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
      ...(coverImage ? { images: [coverImage] } : {}),
    };
  });
  const notificationPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: escapeXml(`${APP_SITE_URL}${getNotificationPostPath(post)}`),
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
    ...(post.image ? { images: [`${APP_SITE_URL}${post.image}`] } : {}),
  }));

  return [...staticPages, ...festivalPages, ...notificationPages];
}
