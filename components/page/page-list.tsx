"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Award,
  CircleDollarSign,
  ListChecks,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import PageTitle from "@/components/page/page-title";

const seasons = ["전체 시기", "봄", "여름", "가을", "겨울"];
const prices = ["전체 가격", "무료", "유료"];

export type EventListItem = {
  slug: string;
  title: string;
  description: string;
  type: string;
  region: string;
  place: string;
  season: string;
  priceType: string;
  price: string;
  program: string;
  status: string;
  month: string;
  day: string;
  weekday: string;
  dDay: string;
  site: string | null;
};

export default function PageList({ events }: { events: EventListItem[] }) {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("전체 지역");
  const [season, setSeason] = useState("전체 시기");
  const [price, setPrice] = useState("전체 가격");
  const regions = useMemo(
    () => [
      "전체 지역",
      ...Array.from(new Set(events.map((event) => event.region))).sort(),
    ],
    [events],
  );
  const filteredEvents = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return events.filter((event) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        [event.title, event.description, event.region, event.place]
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword);
      const matchesRegion = region === "전체 지역" || event.region === region;
      const matchesSeason = season === "전체 시기" || event.season === season;
      const matchesPrice = price === "전체 가격" || event.priceType === price;

      return matchesKeyword && matchesRegion && matchesSeason && matchesPrice;
    });
  }, [events, keyword, price, region, season]);

  function resetFilters() {
    setKeyword("");
    setRegion("전체 지역");
    setSeason("전체 시기");
    setPrice("전체 가격");
  }

  return (
    <>
      <PageTitle
        eyebrow="전국 축제 일정 리스트"
        title="다가오는 전국 축제를"
        highlight="날짜순으로 확인하세요"
        description="개최일과 장소, 가격과 주요 프로그램까지 필요한 축제 정보를 목록에서 빠르게 확인해 보세요."
      />

      <section className="bg-slate-50 py-10 sm:py-14">
        <div className="container">
          <Card className="relative z-10 -mt-24 gap-0 rounded-3xl border-0 bg-white py-0 ring-1 ring-slate-200">
            <CardContent className="gap-5 p-5 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <SlidersHorizontal
                  className="size-4 text-blue-600"
                  aria-hidden="true"
                />
                원하는 조건을 선택해 주세요
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_auto]">
                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="축제명, 지역, 장소 검색"
                    aria-label="축제 검색어"
                    className="h-11! rounded-xl bg-white pr-4 pl-11"
                  />
                </div>

                <Select
                  value={region}
                  onValueChange={(value) => setRegion(value ?? "전체 지역")}
                >
                  <SelectTrigger className="h-11! w-full rounded-xl bg-white px-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={season}
                  onValueChange={(value) => setSeason(value ?? "전체 시기")}
                >
                  <SelectTrigger className="h-11! w-full rounded-xl bg-white px-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={price}
                  onValueChange={(value) => setPrice(value ?? "전체 가격")}
                >
                  <SelectTrigger className="h-11! w-full rounded-xl bg-white px-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prices.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={resetFilters}
                  className="h-11! rounded-xl px-4"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>

          {filteredEvents.length > 0 ? (
            <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
              {filteredEvents.map((event) => (
                <article
                  key={event.slug}
                  className="group grid gap-4 border-b border-slate-200 p-4 transition-colors last:border-b-0 hover:bg-blue-50/40 sm:p-6 lg:grid-cols-[170px_minmax(0,1fr)_52px] lg:items-center lg:gap-8"
                >
                  <div className="flex items-center gap-4 lg:block lg:border-r lg:border-slate-200 lg:py-4 lg:pr-8 lg:text-center">
                    <p className="font-cafe24 text-3xl font-bold tracking-tight text-slate-950">
                      {event.month}.{event.day}
                      <span className="ml-1.5 font-sans text-sm font-medium text-slate-500">
                        {event.weekday}
                      </span>
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-0 rounded-full border-red-300 px-3 text-sm font-medium text-red-500 lg:mt-3"
                    >
                      {event.dDay}
                    </Badge>
                  </div>

                  <Link
                    href={`/festivals/${event.slug}`}
                    className="min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                    aria-label={`${event.title} 상세 보기`}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      <Badge
                        variant="outline"
                        className="rounded-full border-red-300 text-red-500"
                      >
                        {event.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          event.status === "진행 중"
                            ? "rounded-full border-red-500 bg-red-500 text-white"
                            : "rounded-full border-slate-400 text-slate-700"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>

                    <h2
                      className="mt-1 truncate font-cafe24 text-2xl font-bold text-slate-950 sm:text-3xl"
                      title={event.title}
                    >
                      {event.title}
                    </h2>

                    <div className="mt-3 flex min-w-0 flex-wrap gap-x-7 gap-y-2 text-sm text-slate-500 sm:text-[15px]]">
                      <p className="flex min-w-0 items-center gap-2">
                        <MapPin
                          className="size-4 shrink-0 text-pink-500"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          {event.region} · {event.place}
                        </span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2">
                        <CircleDollarSign
                          className="size-4 shrink-0 text-emerald-500"
                          aria-hidden="true"
                        />
                        <span className="truncate">{event.price}</span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2">
                        <ListChecks
                          className="size-4 shrink-0 text-violet-500"
                          aria-hidden="true"
                        />
                        <span
                          className="max-w-80 truncate"
                          title={event.program}
                        >
                          {event.program}
                        </span>
                      </p>
                    </div>
                  </Link>

                  {event.site ? (
                    <a
                      href={event.site}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${event.title} 공식 사이트 열기`}
                      className="hidden size-10 items-center justify-center rounded-full border border-slate-200 text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 lg:flex"
                    >
                      <Award className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="hidden size-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 lg:flex">
                      <Award className="size-4" aria-hidden="true" />
                    </span>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl bg-white py-16 text-center ring-1 ring-slate-200">
              <Search
                className="mx-auto size-7 text-slate-400"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm text-slate-500">
                조건에 맞는 축제가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
