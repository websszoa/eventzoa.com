import type { MetadataRoute } from "next";

import eventLastmod from "@/data/events/lastmod.json";
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

// 축제별 데이터 변경일. scripts/update-event-lastmod.mjs가 갱신한다.
const festivalLastmod: Record<string, { updatedAt: string } | undefined> =
  eventLastmod;

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
  // 축제 목록을 보여주는 페이지는 가장 최근에 바뀐 축제 날짜를 따른다.
  const festivalsLastmod = latest(
    uniqueFestivals.map((event) => festivalLastmod[event.slug]?.updatedAt),
  );

  // 날짜를 알 수 없는 페이지(소개·약관 등)는 lastModified를 넣지 않는다.
  const staticPages = [
    {
      path: "",
      changeFrequency: "daily" as const,
      priority: 1,
      lastModified: festivalsLastmod,
    },
    {
      path: "/festivals",
      changeFrequency: "daily" as const,
      priority: 0.9,
      lastModified: festivalsLastmod,
    },
    {
      path: "/list",
      changeFrequency: "daily" as const,
      priority: 0.8,
      lastModified: festivalsLastmod,
    },
    {
      path: "/calendar",
      changeFrequency: "daily" as const,
      priority: 0.8,
      lastModified: festivalsLastmod,
    },
    {
      path: "/map",
      changeFrequency: "weekly" as const,
      priority: 0.7,
      lastModified: festivalsLastmod,
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
    const lastModified = festivalLastmod[event.slug]?.updatedAt;

    return {
      url: `${APP_SITE_URL}/festivals/${event.slug}`,
      ...(lastModified ? { lastModified } : {}),
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
