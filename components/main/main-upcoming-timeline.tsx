import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CircleDollarSign,
  MapPin,
} from "lucide-react";

import MainSectionHeader from "@/components/main/main-section-header";
import { Badge } from "@/components/ui/badge";
import { getFestivalsHref } from "@/lib/festival-filters";
import {
  getUpcomingFestivals,
  type MainFestivalItem,
} from "@/lib/main-festivals.server";

function groupByMonth(festivals: MainFestivalItem[]) {
  const groups = new Map<string, MainFestivalItem[]>();

  for (const festival of festivals) {
    groups.set(festival.monthKey, [
      ...(groups.get(festival.monthKey) ?? []),
      festival,
    ]);
  }

  return Array.from(groups, ([monthKey, items]) => ({
    year: monthKey.slice(0, 4),
    month: Number(monthKey.slice(5, 7)),
    items,
  }));
}

// ① 다가오는 축제 타임라인: 개최 예정 축제를 월별로 묶어 날짜순으로 보여준다.
export default function MainUpcomingTimeline() {
  const groups = groupByMonth(getUpcomingFestivals());

  // 진행 중 섹션이 없으면 흰 섹션이 이어지므로 위쪽 구분선을 둔다.
  return (
    <section className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <MainSectionHeader
          icon={CalendarClock}
          eyebrow="미리 계획해요"
          title="다가오는 축제 타임라인"
          description="곧 열릴 축제를 날짜순으로 정리했어요. 다음 나들이 일정을 미리 세워보세요."
          action={{ href: "/list", label: "축제 일정 리스트" }}
        />

        {groups.length > 0 ? (
          <ol className="mt-10 space-y-10">
            {groups.map(({ year, month, items }) => (
              <li
                key={`${year}-${month}`}
                className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-10"
              >
                <div className="flex items-end justify-between gap-4 lg:block">
                  <div>
                    <p className="font-anyvid text-sm text-slate-400">{year}</p>
                    <h3 className="font-cafe24 text-4xl font-bold text-slate-950">
                      {month}월
                    </h3>
                  </div>
                  <Link
                    href={getFestivalsHref({ month })}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-blue-600 lg:mt-3"
                  >
                    {month}월 축제 모두 보기
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <ol className="relative space-y-3 border-l-2 border-blue-100 pl-6 sm:pl-8">
                  {items.map((festival) => (
                    <li key={festival.slug} className="relative">
                      <span
                        className="absolute top-1/2 -left-7.75 size-3 -translate-y-1/2 rounded-full bg-blue-600 ring-4 ring-white sm:-left-9.75"
                        aria-hidden="true"
                      />
                      <Link
                        href={festival.href}
                        aria-label={`${festival.title} 상세 보기`}
                        className="group grid items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition-colors hover:bg-blue-50/40 hover:ring-blue-200 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:p-5"
                      >
                        <div className="flex items-center gap-3 sm:block sm:border-r sm:border-slate-200 sm:pr-4 sm:text-center">
                          <p className="font-cafe24 text-2xl font-bold text-slate-950">
                            {festival.startLabel}
                            <span className="ml-1 font-sans text-xs font-medium text-slate-500">
                              {festival.weekday}
                            </span>
                          </p>
                          <Badge
                            variant="outline"
                            className="rounded-full border-blue-600 text-blue-600 sm:mt-1"
                          >
                            {festival.dDay}
                          </Badge>
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-1">
                            <Badge
                              variant="outline"
                              className="rounded-full border-blue-600 text-blue-600"
                            >
                              {festival.type}
                            </Badge>
                            <Badge className="rounded-full border-blue-600 bg-blue-600 text-white">
                              개최예정
                            </Badge>
                          </div>
                          <h4 className="mt-1.5 truncate font-cafe24 text-xl font-bold text-slate-950 transition-colors group-hover:text-blue-600 sm:text-2xl">
                            {festival.title}
                          </h4>
                          <div className="mt-1.5 flex min-w-0 flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                            <span className="flex min-w-0 items-center gap-1.5">
                              <MapPin
                                className="size-4 shrink-0 text-pink-500"
                                aria-hidden="true"
                              />
                              <span className="truncate">
                                {festival.region} · {festival.place}
                              </span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CircleDollarSign
                                className="size-4 shrink-0 text-emerald-500"
                                aria-hidden="true"
                              />
                              {festival.price}
                            </span>
                          </div>
                        </div>

                        <span className="hidden size-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-blue-200 group-hover:text-blue-600 sm:flex">
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-10 rounded-3xl bg-slate-50 px-6 py-14 text-center ring-1 ring-slate-200">
            <CalendarClock
              className="mx-auto size-9 text-slate-300"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-slate-500">
              새로운 축제 일정을 준비하고 있어요. 곧 업데이트될 예정이에요.
            </p>
            <Link
              href={getFestivalsHref({ includePast: true })}
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600"
            >
              지난 축제 둘러보기
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
