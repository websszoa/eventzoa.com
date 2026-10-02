import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";

export {
  notificationCategories,
  notificationCategoryLabels,
  type NotificationCategory,
} from "@/lib/notifications-shared";
import {
  notificationCategories,
  type NotificationCategory,
} from "@/lib/notifications-shared";

const frontmatterSchema = z.object({
  title: z.string().min(1),
  category: z.enum(notificationCategories),
  excerpt: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  featured: z.boolean().optional().default(false),
  image: z.string().startsWith("/").optional(),
  keywords: z.array(z.string().min(1)).optional().default([]),
});

export type NotificationPost = z.infer<typeof frontmatterSchema> & {
  slug: string;
  readingTime: string;
  source: string;
};

export function getNotificationCategoryPath(category: NotificationCategory) {
  if (category === "festival") return "/blog";
  if (category === "newsletter") return "/newsletter";
  return `/notifications?category=${category}`;
}

export function getNotificationPostPath(post: NotificationPost) {
  const categoryPath = getNotificationCategoryPath(post.category);
  if (post.category === "festival" || post.category === "newsletter") {
    return `${categoryPath}/${post.slug}`;
  }
  return `${categoryPath}&post=${post.slug}`;
}

const notificationsDirectory = path.join(
  process.cwd(),
  "content",
  "notifications",
);

export const getNotificationPosts = cache(async () => {
  const files = (await readdir(notificationsDirectory))
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  const posts = await Promise.all(
    files.map(async (file): Promise<NotificationPost> => {
      const source = await readFile(path.join(notificationsDirectory, file), "utf8");
      const { data, content } = matter(source);
      const parsed = frontmatterSchema.safeParse(data);

      if (!parsed.success) {
        throw new Error(
          `Invalid notification frontmatter in ${file}: ${parsed.error.message}`,
        );
      }

      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

      return {
        ...parsed.data,
        slug: file.replace(/\.mdx$/, ""),
        readingTime: `${Math.max(1, Math.ceil(wordCount / 220))}분`,
        source: content,
      };
    }),
  );

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export async function getNotificationPost(slug: string) {
  const posts = await getNotificationPosts();
  return posts.find((post) => post.slug === slug);
}

export function formatNotificationDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(`${date}T00:00:00+09:00`));
}
