import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Radio } from "lucide-react";

import MainSectionHeader from "@/components/main/main-section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFestivalsHref } from "@/lib/festival-filters";
import { getOngoingFestivals } from "@/lib/main-festivals.server";

// ⑤ 지금 진행 중인 축제: 진행 중 상태는 사이트 전체에서 빨간색으로 표시한다.
export default function MainOngoingEvents() {
  const festivals = getOngoingFestivals();

  if (festivals.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="container">
        <MainSectionHeader
          tone="slate"
          icon={Radio}
          eyebrow="지금 열리고 있어요"
          title="오늘 바로 갈 수 있는 축제"
          description="지금 이 순간 전국에서 진행 중인 축제예요. 끝나기 전에 서둘러 방문해 보세요."
          action={{
            href: getFestivalsHref({ status: "진행 중" }),
            label: "진행 중인 축제 보기",
          }}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {festivals.map((festival) => (
            <Link
              key={festival.slug}
              href={festival.href}
              aria-label={`${festival.title} 상세 보기`}
              className="group rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            >
              <Card className="h-full gap-0 rounded-3xl border-0 bg-white py-0 ring-1 ring-slate-200 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-red-200">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge className="rounded-full border-red-500 bg-red-500 text-white">
                        <span
                          className="size-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none"
                          aria-hidden="true"
                        />
                        진행중
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full border-red-500 text-red-500"
                      >
                        {festival.dDay}
                      </Badge>
                    </div>
                    <ArrowUpRight
                      className="size-5 text-slate-300 transition-colors group-hover:text-red-500"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="line-clamp-2 font-cafe24 text-2xl leading-tight font-bold text-slate-950">
                    {festival.title}
                  </h3>

                  <div className="mt-auto space-y-1.5 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <CalendarDays
                        className="size-4 shrink-0 text-red-500"
                        aria-hidden="true"
                      />
                      <span>
                        {festival.dateRange}
                        <span className="ml-1.5 font-bold text-red-500">
                          {festival.daysLeft === 0
                            ? "오늘 마감"
                            : `${festival.daysLeft}일 남음`}
                        </span>
                      </span>
                    </p>
                    <p className="flex min-w-0 items-center gap-2">
                      <MapPin
                        className="size-4 shrink-0 text-pink-500"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {festival.region} · {festival.place}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
