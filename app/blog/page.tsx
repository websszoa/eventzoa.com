import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";

import { formatNotificationDate, getNotificationPosts } from "@/lib/notifications";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "블로그",
  description: "지금 주목할 축제와 계절별 나들이 정보를 깊이 있는 블로그 이야기로 만나보세요.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = (await getNotificationPosts()).filter((post) => post.category === "festival");

  return (
    <>
      <section className="bg-linear-to-br from-sky-50 via-blue-50/40 to-white">
        <div className="container py-14 sm:py-18 lg:py-16">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-200"><BookOpen className="size-6" aria-hidden="true" /></div>
          <p className="mt-6 text-sm font-bold tracking-widest text-blue-600 uppercase">Festival Stories</p>
          <h1 className="mt-2 font-cafe24 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">블로그</h1>
          <p className="mt-5 break-keep text-[15px] leading-7 text-slate-600">화제가 되는 축제와 주말 나들이 정보를 직접 고르고 깊이 있게 전합니다.</p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-blue-600">Editor&apos;s Pick</p>
              <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">이번 계절에 꼭 읽어볼 이야기</h2>
            </div>
            <p className="text-sm text-slate-400">총 {posts.length}편</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <Link href={`/blog/${post.slug}`} className="block">
                  {post.image && (
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <Image src={post.image} alt="" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                  )}
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{formatNotificationDate(post.publishedAt)}</span>
                      <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" />{post.readingTime} 읽기</span>
                    </div>
                    <h3 className="mt-4 break-keep font-cafe24 text-3xl leading-tight font-bold text-slate-950 transition-colors group-hover:text-blue-600">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 break-keep text-sm leading-6 text-slate-500">{post.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">이야기 읽기<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
