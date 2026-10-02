import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MailOpen } from "lucide-react";

import { formatNotificationDate, getNotificationPosts } from "@/lib/notifications";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "뉴스레터",
  description: "놓치기 아까운 전국 축제와 행사 소식을 이벤트조아 뉴스레터로 모아보세요.",
  path: "/newsletter",
});

export default async function NewsletterPage() {
  const posts = (await getNotificationPosts()).filter((post) => post.category === "newsletter");

  return (
    <>
      <section className="bg-linear-to-br from-sky-50 via-blue-50/40 to-white">
        <div className="container py-14 sm:py-18 lg:py-16">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-200"><MailOpen className="size-6" aria-hidden="true" /></div>
          <p className="mt-6 text-sm font-bold tracking-widest text-blue-600 uppercase">Newsletter</p>
          <h1 className="mt-2 font-cafe24 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">뉴스레터</h1>
          <p className="mt-5 break-keep text-[15px] leading-7 text-slate-600">놓치기 아까운 전국의 축제와 행사 소식을 한곳에 모아 전합니다.</p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-28">
            <p className="text-sm font-bold text-blue-600">뉴스레터 모아보기</p>
            <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">축제 소식을 편하게 읽어보세요</h2>
            <p className="mt-4 break-keep text-sm leading-6 text-slate-500">계절별 추천과 주목할 행사 소식을 발행일 순서로 정리했습니다.</p>
          </aside>

          <main className="min-w-0 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
            <div className="divide-y divide-slate-200">
              {posts.slice(0, 10).map((post, index) => (
                <Link key={post.slug} href={`/newsletter/${post.slug}`} className="group grid gap-4 px-6 py-6 transition-colors hover:bg-blue-50/50 sm:grid-cols-[52px_120px_minmax(0,1fr)_40px] sm:items-center sm:px-8 lg:px-10">
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
          </main>
        </div>
      </section>
    </>
  );
}
