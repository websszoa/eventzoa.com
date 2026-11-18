import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bell, Megaphone, RefreshCw } from "lucide-react";

import PageNotificationArticle from "@/components/page/page-notification-article";
import NotificationToc from "@/components/page/page-notification-toc";
import { APP_NAME, APP_SITE_URL } from "@/lib/constants";
import { extractMdxHeadings } from "@/lib/mdx";
import {
  formatNotificationDate,
  getNotificationPostPath,
  getNotificationPosts,
  notificationCategoryLabels,
} from "@/lib/notifications";
import { createPageMetadata } from "@/lib/seo";

type NotificationsPageProps = {
  searchParams: Promise<{ category?: string; post?: string }>;
};

const boardCategories = ["notice", "update"] as const;
type BoardCategory = (typeof boardCategories)[number];

export async function generateMetadata({ searchParams }: NotificationsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const posts = await getNotificationPosts();
  const post = params.post ? posts.find((item) => item.slug === params.post) : undefined;

  if (!post || post.category === "festival" || post.category === "newsletter") {
    return createPageMetadata({
      title: "공지사항",
      description: `${APP_NAME} 서비스 공지사항과 업데이트 소식을 확인하세요.`,
      path: "/notifications",
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: getNotificationPostPath(post),
    type: "article",
    publishedTime: `${post.publishedAt}T00:00:00+09:00`,
  });
}

const categoryCards = [
  { category: "notice", icon: Megaphone, description: "서비스 이용에 필요한 주요 안내" },
  { category: "update", icon: RefreshCw, description: "새롭게 달라진 기능과 개선 소식" },
] satisfies Array<{ category: BoardCategory; icon: typeof Bell; description: string }>;

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const params = await searchParams;

  if (params.category === "festival") redirect(`/blog${params.post ? `/${params.post}` : ""}`);
  if (params.category === "newsletter") redirect(`/newsletter${params.post ? `/${params.post}` : ""}`);

  const category: BoardCategory = boardCategories.includes(params.category as BoardCategory)
    ? (params.category as BoardCategory)
    : "notice";
  const allPosts = await getNotificationPosts();
  const posts = allPosts.filter((post) => post.category === category);
  const selectedPost = params.post ? posts.find((post) => post.slug === params.post) : undefined;
  const headings = selectedPost ? extractMdxHeadings(selectedPost.source) : [];
  const categoryHref = `/notifications?category=${category}`;
  const articleSchema = selectedPost
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: selectedPost.title,
        description: selectedPost.excerpt,
        datePublished: selectedPost.publishedAt,
        dateModified: selectedPost.publishedAt,
        inLanguage: "ko-KR",
        mainEntityOfPage: `${APP_SITE_URL}${getNotificationPostPath(selectedPost)}`,
        author: { "@type": "Organization", name: APP_NAME },
        publisher: { "@type": "Organization", name: APP_NAME },
      }
    : null;

  return (
    <>
      <section className="bg-linear-to-br from-sky-50 via-blue-50/40 to-white">
        <div className="container py-14 sm:py-18 lg:py-16">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-200">
            <Bell className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-bold tracking-widest text-blue-600 uppercase">Notice</p>
          <h1 className="mt-2 font-cafe24 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">공지사항</h1>
          <p className="mt-5 break-keep text-[15px] leading-7 text-slate-600">이벤트조아 서비스 이용에 필요한 안내와 업데이트 소식을 전합니다.</p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
          {selectedPost ? (
            <NotificationToc category={category} headings={headings} backHref={categoryHref} />
          ) : (
            <aside className="lg:sticky lg:top-28">
              <div className="mb-6">
                <p className="text-sm font-bold text-blue-600">알림 모아보기</p>
                <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">필요한 소식을 선택하세요</h2>
              </div>
              <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label="알림 분류">
                {categoryCards.map(({ category: item, icon: Icon, description }) => {
                  const isActive = category === item;
                  return (
                    <Link key={item} href={`/notifications?category=${item}`} aria-current={isActive ? "page" : undefined} className={`group rounded-2xl border p-5 transition-colors ${isActive ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"}`}>
                      <div className="flex items-start gap-4">
                        <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${isActive ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}><Icon className="size-5" aria-hidden="true" /></div>
                        <div>
                          <h3 className="font-cafe24 text-xl font-bold text-slate-950">{notificationCategoryLabels[item]}</h3>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          )}

          <main className="min-w-0 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
            {selectedPost ? (
              <PageNotificationArticle post={selectedPost} backHref={categoryHref} />
            ) : (
              <div className="divide-y divide-slate-200">
                {posts.slice(0, 10).map((post, index) => (
                  <Link key={post.slug} href={getNotificationPostPath(post)} className="group grid gap-4 px-6 py-6 transition-colors hover:bg-blue-50/50 sm:grid-cols-[52px_120px_minmax(0,1fr)_40px] sm:items-center sm:px-8 lg:px-10">
                    <span className="grid size-11 place-items-center rounded-xl bg-slate-100 font-anyvid text-lg text-slate-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">{String(index + 1).padStart(2, "0")}</span>
                    <div className="text-xs leading-5 text-slate-400"><p>{formatNotificationDate(post.publishedAt)}</p><p>{post.readingTime} 읽기</p></div>
                    <div>
                      <h2 className="break-keep font-cafe24 text-2xl font-bold text-slate-950 transition-colors group-hover:text-blue-600">{post.title}</h2>
                      <p className="mt-2 line-clamp-2 break-keep text-sm leading-6 text-slate-500">{post.excerpt}</p>
                    </div>
                    <span className="hidden size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors group-hover:border-blue-200 group-hover:text-blue-600 sm:flex"><ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
      {articleSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />}
    </>
  );
}
