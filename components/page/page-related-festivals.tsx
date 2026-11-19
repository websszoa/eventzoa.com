import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFestivalsHref } from "@/lib/festival-filters";
import {
  getRelatedFestivals,
  type FestivalData,
} from "@/lib/festival-data.server";

function formatShortDate(date: string | null) {
  if (!date) return null;
  const [, month, day] = date.split("-");
  return `${Number(month)}.${Number(day)}`;
}

function getDateRange({ startDate, endDate }: FestivalData["event"]) {
  const start = formatShortDate(startDate);
  const end = formatShortDate(endDate);
  if (!start) return "일정 미정";
  return !end || start === end ? start : `${start} – ${end}`;
}

function getStatus({ startDate, endDate }: FestivalData["event"]) {
  if (!startDate || !endDate) return "일정 미정";
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  if (today < startDate) return "개최 예정";
  if (today > endDate) return "종료";
  return "진행 중";
}

const statusClassName: Record<string, string> = {
  "진행 중": "border-red-500 bg-red-500 text-white",
  "개최 예정": "border-blue-600 bg-blue-600 text-white",
  종료: "border-slate-300 bg-slate-100 text-slate-500",
  "일정 미정": "border-slate-300 bg-white text-slate-500",
};

// 상세페이지 하단 내부 링크: 같은 지역·같은 종류의 축제로 이어 준다.
export default function PageRelatedFestivals({
  festival,
}: {
  festival: FestivalData;
}) {
  const related = getRelatedFestivals(festival);

  if (related.length === 0) return null;

  const region = festival.location.region;

  return (
    <section
      aria-labelledby="related-festivals-title"
      className="border-t border-slate-100 bg-slate-50 py-12 sm:py-16"
    >
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-600">더 둘러보기</p>
            <h2
              id="related-festivals-title"
              className="mt-1 font-cafe24 text-3xl font-bold text-slate-950"
            >
              함께 보면 좋은 축제
            </h2>
          </div>
          {region && (
            <Link
              href={getFestivalsHref({ regions: [region] })}
              className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
            >
              {region} 축제 더보기
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map(({ festival: item }) => {
            const status = getStatus(item.event);

            return (
              <li key={item.slug}>
                <Link
                  href={`/festivals/${item.slug}`}
                  className="group block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                >
                  <Card className="h-full gap-0 rounded-3xl border-0 bg-white py-0 ring-1 ring-slate-200 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-blue-200">
                    <CardContent className="flex h-full flex-col gap-3 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            className={`rounded-full ${statusClassName[status]}`}
                          >
                            {status}
                          </Badge>
                          {item.info.type && (
                            <Badge
                              variant="outline"
                              className="rounded-full border-slate-200 bg-white text-slate-600"
                            >
                              {item.info.type}
                            </Badge>
                          )}
                        </div>
                        <ArrowUpRight
                          className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="line-clamp-2 font-cafe24 text-xl leading-tight font-bold break-keep text-slate-950 group-hover:text-blue-700">
                        {item.name}
                      </h3>
                      <div className="mt-auto space-y-1 text-sm text-slate-500">
                        <p className="flex items-center gap-2">
                          <CalendarDays
                            className="size-4 shrink-0 text-emerald-600"
                            aria-hidden="true"
                          />
                          {getDateRange(item.event)}
                        </p>
                        <p className="flex min-w-0 items-center gap-2">
                          <MapPin
                            className="size-4 shrink-0 text-rose-500"
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {[item.location.region, item.location.venue]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
