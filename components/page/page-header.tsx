import { Fragment } from "react";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { siteMenu, supportMenu } from "@/lib/navigation";
import { getTodayLabel } from "@/lib/utils";

import PageHeaderSheet from "@/components/page/page-header-sheet";

export default function PageHeader() {
  return (
    <>
      <div className="border-b border-gray-100 bg-gray-50 text-slate-900">
        <div className="container flex h-9 items-center justify-between text-xs sm:text-xs">
          <p>
            {getTodayLabel()} · 오늘 전국에서 열리는 행사{" "}
            <strong className="font-bold text-blue-600">386건</strong>
          </p>
          <nav
            className="hidden items-center gap-3 sm:flex"
            aria-label="고객 지원 메뉴"
          >
            {supportMenu.map((item, index) => (
              <Fragment key={item.href}>
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
            <PageHeaderSheet />
          </div>
        </div>
      </header>
    </>
  );
}
