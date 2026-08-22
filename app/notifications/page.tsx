import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import NotificationToc from "@/components/page/page-notification-toc";
import { APP_NAME } from "@/lib/constants";
import { createHeadingId, extractMdxHeadings } from "@/lib/mdx";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Clock3,
  Megaphone,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import {
  formatNotificationDate,
  getNotificationPosts,
  notificationCategories,
  notificationCategoryLabels,
  type NotificationCategory,
} from "@/lib/notifications";

export const metadata: Metadata = {
  title: "알림",
  description: `${APP_NAME} 축제소식, 공지사항, 서비스 업데이트와 뉴스레터를 확인하세요.`,
  alternates: { canonical: "/notifications" },
};

const categoryCards = [
  {
    category: "festival",
    icon: BookOpen,
    description: "축제를 더 즐겁게 만나는 이야기",
  },
  {
    category: "notice",
    icon: Megaphone,
    description: "서비스 이용에 필요한 주요 안내",
  },
  {
    category: "update",
    icon: RefreshCw,
    description: "새롭게 달라진 기능과 개선 소식",
  },
  {
    category: "newsletter",
    icon: Newspaper,
    description: "주목할 만한 축제 소식 모음",
  },
] satisfies Array<{
  category: NotificationCategory;
  icon: typeof Bell;
  description: string;
}>;

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; post?: string }>;
}) {
  const params = await searchParams;
  const category: NotificationCategory = notificationCategories.includes(
    params.category as NotificationCategory,
  )
    ? (params.category as NotificationCategory)
    : "festival";
  const allPosts = await getNotificationPosts();
  const posts = allPosts.filter((post) => post.category === category);
  const selectedPost = params.post
    ? posts.find((post) => post.slug === params.post)
    : undefined;
  const visiblePosts = posts.slice(0, 10);
  const selectedContent = selectedPost
    ? await compileMDX({
        source: selectedPost.source,
        components: mdxComponents,
        options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
      })
    : null;
  const headings = selectedPost ? extractMdxHeadings(selectedPost.source) : [];

  return (
    <>
      <section className="bg-linear-to-br from-sky-50 via-blue-50/40 to-white">
        <div className="container py-14 sm:py-18 lg:py-16">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-200">
            <Bell className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-bold tracking-widest text-blue-600 uppercase">
            News & Stories
          </p>
          <h1 className="mt-2 font-cafe24 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            알림
          </h1>
          <p className="mt-5 break-keep text-[15px] leading-7 text-slate-600">
            이벤트조아의 새로운 소식과 축제를 더 즐겁게 만나는 이야기를
            전합니다.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
          {selectedPost ? (
            <NotificationToc category={category} headings={headings} />
          ) : (
            <aside className="lg:sticky lg:top-28">
              <div className="mb-6">
                <p className="text-sm font-bold text-blue-600">알림 모아보기</p>
                <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">
                  관심 있는 소식을 선택하세요
                </h2>
              </div>
              <nav
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
                aria-label="알림 분류"
              >
                {categoryCards.map(
                  ({ category: item, icon: Icon, description }) => {
                    const isActive = category === item;
                    return (
                      <Link
                        key={item}
                        href={`/notifications?category=${item}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`group rounded-2xl border p-5 transition-all ${isActive ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"}`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`grid size-10 shrink-0 place-items-center rounded-xl ${isActive ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
                          >
                            <Icon className="size-5" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-cafe24 text-xl font-bold text-slate-950">
                              {notificationCategoryLabels[item]}
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  },
                )}
              </nav>
            </aside>
          )}

          <main className="min-w-0 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
            {selectedPost ? (
              <article className="p-6 sm:p-8 lg:p-10">
                <Link
                  href={`/notifications?category=${category}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600"
                >
                  <ArrowLeft className="size-4" />
                  목록으로 돌아가기
                </Link>
                <Badge className="mt-4 flex h-6 w-fit items-center justify-center rounded-full bg-blue-600 px-3 text-white">
                  {notificationCategoryLabels[selectedPost.category]}
                </Badge>
                <h2 className="mt-5 break-keep font-cafe24 text-4xl leading-tight font-bold text-slate-950 sm:text-5xl">
                  {selectedPost.title}
                </h2>
                <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {formatNotificationDate(selectedPost.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="size-4" />
                    읽는 시간 {selectedPost.readingTime}
                  </span>
                </div>
                <div className="mt-9 border-t border-slate-200 pt-9 text-[16px] leading-8 text-slate-700">
                  {selectedContent?.content}
                </div>
              </article>
            ) : (
              <>
                <div className="divide-y divide-slate-200">
                  {visiblePosts.map((post, index) => (
                    <Link
                      key={post.slug}
                      href={`/notifications?category=${category}&post=${post.slug}`}
                      className="group grid gap-4 px-6 py-6 transition-colors hover:bg-blue-50/50 sm:grid-cols-[52px_120px_minmax(0,1fr)_40px] sm:items-center sm:px-8 lg:px-10"
                    >
                      <span className="grid size-11 place-items-center rounded-xl bg-slate-100 font-anyvid text-lg text-slate-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="text-xs leading-5 text-slate-400">
                        <p>{formatNotificationDate(post.publishedAt)}</p>
                        <p>{post.readingTime} 읽기</p>
                      </div>
                      <div>
                        <h3 className="break-keep font-cafe24 text-2xl font-bold text-slate-950 transition-colors group-hover:text-blue-600">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 break-keep text-sm leading-6 text-slate-500">
                          {post.excerpt}
                        </p>
                      </div>
                      <span className="hidden size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all group-hover:border-blue-200 group-hover:text-blue-600 sm:flex">
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </section>
    </>
  );
}

const mdxComponents = {
  h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
    <h2
      id={createHeadingId(String(children))}
      className="mt-10 mb-4 scroll-mt-28 font-cafe24 text-3xl font-bold text-slate-950"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="mt-8 mb-3 font-cafe24 text-2xl font-bold text-slate-950"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-6 break-keep" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-6 list-disc space-y-2 pl-6" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-7 border-l-4 border-blue-500 bg-blue-50 px-5 py-4 text-blue-950"
      {...props}
    />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="font-bold text-blue-600 underline underline-offset-4"
      {...props}
    />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <table className="my-7 w-full border-collapse text-sm" {...props} />
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th
      className="border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-950"
      {...props}
    />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border border-slate-200 px-4 py-3" {...props} />
  ),
};
