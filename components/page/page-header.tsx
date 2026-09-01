import { Fragment } from "react";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { uniqueFestivals } from "@/lib/festival-data.server";
import { siteMenu, supportMenu } from "@/lib/navigation";
import { getTodayLabel } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

import PageHeaderSheet from "@/components/page/page-header-sheet";

export default async function PageHeader() {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const activeEvents = uniqueFestivals.filter(({ event }) => {
    const { startDate, endDate } = event;
    return Boolean(startDate && endDate && startDate <= today && endDate >= today);
  });
  const activeEventHref =
    activeEvents.length === 1
      ? `/festivals/${activeEvents[0].slug}`
      : "/calendar";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let member = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, visit_count, role")
      .eq("id", user.id)
      .maybeSingle();
    const metadata = user.user_metadata;

    member = {
      name:
        profile?.display_name ||
        metadata.full_name ||
        metadata.name ||
        user.email?.split("@")[0] ||
        "회원",
      avatarUrl:
        profile?.avatar_url || metadata.avatar_url || metadata.picture || null,
      visitCount: profile?.visit_count ?? 1,
      role: profile?.role === "admin" ? ("admin" as const) : ("user" as const),
    };
  }

  return (
    <>
      <div className="border-b border-gray-100  text-slate-900">
        <div className="container flex h-9 items-center justify-between text-xs sm:text-xs">
          <Link
            href={activeEventHref}
            className="rounded-sm transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={`오늘 전국에서 열리는 행사 ${activeEvents.length}건 보기`}
          >
            {getTodayLabel()} · 오늘 전국에서 열리는 행사{" "}
            <strong className="font-bold text-blue-600">
              {activeEvents.length}건
            </strong>
          </Link>
          <nav
            className="hidden items-center gap-3 sm:flex"
            aria-label="고객 지원 메뉴"
          >
            {supportMenu.map((item, index) => (
              <Fragment key={`${item.label}-${item.href}`}>
                {index === supportMenu.length - 1 && (
                  <span aria-hidden="true">·</span>
                )}
                <a
                  className={`text-slate-900 hover:text-black ${index === 0 ? "mr-1" : ""}`}
                  href={item.href}
                >
                  {item.label}
                </a>
              </Fragment>
            ))}
          </nav>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white text-slate-900">
        <div className="container">
          <div className="flex items-center justify-between py-2 sm:py-3">
            <div className="flex items-center gap-12">
              <Link
                href="/"
                className="pb-1.5 font-heading text-3xl font-black tracking-[-0.06em] text-blue-700"
                aria-label={`${APP_NAME} 홈`}
              >
                {APP_NAME}
              </Link>
              <nav
                className="hidden items-center gap-8 text-[15px] text-slate-600 md:flex"
                aria-label="주요 메뉴"
              >
                {siteMenu.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="transition-colors hover:text-blue-600"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            <PageHeaderSheet member={member} />
          </div>
        </div>
      </header>
    </>
  );
}
