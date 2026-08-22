"use client";

import Link from "next/link";
import { BookOpen, Megaphone, Newspaper, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import {
  notificationCategoryLabels,
  type NotificationCategory,
} from "@/lib/notifications-shared";

const categoryDetails = {
  festival: { icon: BookOpen, description: "축제를 더 즐겁게 만나는 이야기" },
  notice: { icon: Megaphone, description: "서비스 이용에 필요한 주요 안내" },
  update: { icon: RefreshCw, description: "새롭게 달라진 기능과 개선 소식" },
  newsletter: { icon: Newspaper, description: "주목할 만한 축제 소식 모음" },
} satisfies Record<
  NotificationCategory,
  { icon: typeof BookOpen; description: string }
>;

export default function NotificationToc({
  category,
  headings,
}: {
  category: NotificationCategory;
  headings: Array<{ id: string; title: string }>;
}) {
  const [activeHeading, setActiveHeading] = useState(headings[0]?.id ?? "");
  const { icon: Icon, description } = categoryDetails[category];

  useEffect(() => {
    let frame = 0;

    function updateActiveHeading() {
      let current = headings[0]?.id ?? "";

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 160) {
          current = heading.id;
        }
      }

      setActiveHeading(current);
    }

    function handleScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveHeading);
    }

    frame = requestAnimationFrame(updateActiveHeading);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [headings]);

  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      <div>
        <p className="text-sm font-bold text-blue-600">알림 모아보기</p>
        <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">
          관심 있는 소식을 선택하세요
        </h2>
      </div>
      <Link
        href={`/notifications?category=${category}`}
        className="block rounded-2xl border border-blue-300 bg-blue-50 p-5"
      >
        <div className="flex items-start gap-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-cafe24 text-xl font-bold text-slate-950">
              {notificationCategoryLabels[category]}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </Link>

      {headings.length > 0 && (
        <nav aria-label="글 목차">
          <p className="font-cafe24 text-2xl font-bold text-slate-950">
            글 목차
          </p>
          <ol className="mt-5 border-l border-slate-200 py-0.5">
            {headings.map((heading) => {
              const isActive = activeHeading === heading.id;
              return (
                <li
                  key={heading.id}
                  className={`relative before:absolute before:top-0 before:-left-px before:h-full before:w-0.75 before:bg-blue-500 before:transition-opacity ${isActive ? "before:opacity-100" : "before:opacity-0"}`}
                >
                  <a
                    href={`#${heading.id}`}
                    title={heading.title}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setActiveHeading(heading.id)}
                    className={`block break-keep py-1.5 pl-4 text-sm leading-6 transition-colors hover:text-blue-600 ${isActive ? "font-bold text-blue-600" : "text-slate-500"}`}
                  >
                    {heading.title}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </aside>
  );
}
