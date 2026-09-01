"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  CarFront,
  CircleDollarSign,
  ListChecks,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TicketCheck,
} from "lucide-react";

import PageFestivalImage from "@/components/page/page-festival-image";
import PageTitle from "@/components/page/page-title";

export type FestivalListItem = {
  slug: string;
  title: string;
  description: string;
  region: string;
  type: string;
  season: string;
  month: number | null;
  status: string;
  price: string;
  entrance: string;
  registration: string;
  date: string;
  startDate: string | null;
  place: string;
  parking: string;
  program: string;
  image: string;
  site: string | null;
};

const seasons = ["전체 시기", "봄", "여름", "가을", "겨울", "일정 미정"];
const prices = ["전체 가격", "무료", "유료"];
const statuses = ["전체", "개최 예정", "진행 중", "종료", "일정 미정"];
const months = Array.from({ length: 12 }, (_, index) => index + 1);

export default function PageFestival({
  festivals,
  initialKeyword = "",
}: {
  festivals: FestivalListItem[];
  initialKeyword?: string;
}) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [region, setRegion] = useState("전체 지역");
  const [season, setSeason] = useState("전체 시기");
  const [price, setPrice] = useState("전체 가격");
  const [status, setStatus] = useState("전체");
  const [month, setMonth] = useState<number | null>(null);
  const [sort, setSort] = useState("빠른 개최순");
  const regions = useMemo(
    () => [
      "전체 지역",
      ...Array.from(
        new Set(festivals.map((festival) => festival.region)),
      ).sort(),
    ],
    [festivals],
  );

  const filteredFestivals = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return festivals
      .filter((festival) => {
        const matchesKeyword =
          normalizedKeyword.length === 0 ||
          [
            festival.title,
            festival.description,
            festival.region,
            festival.place,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedKeyword);
        const matchesRegion =
          region === "전체 지역" || festival.region === region;
        const matchesSeason =
          season === "전체 시기" || festival.season === season;
        const matchesPrice = price === "전체 가격" || festival.price === price;
        const matchesStatus = status === "전체" || festival.status === status;
        const matchesMonth = month === null || festival.month === month;

        return (
          matchesKeyword &&
          matchesRegion &&
          matchesSeason &&
          matchesPrice &&
          matchesStatus &&
          matchesMonth
        );
      })
      .sort((a, b) => {
        if (sort === "이름순") return a.title.localeCompare(b.title, "ko");
        if (sort === "지역순") return a.region.localeCompare(b.region, "ko");
        if (!a.startDate) return b.startDate ? 1 : 0;
        if (!b.startDate) return -1;
        return a.startDate.localeCompare(b.startDate);
      });
  }, [festivals, keyword, month, price, region, season, sort, status]);

  function resetFilters() {
    setKeyword("");
    setRegion("전체 지역");
    setSeason("전체 시기");
    setPrice("전체 가격");
    setStatus("전체");
    setMonth(null);
    setSort("빠른 개최순");
  }

  return (
    <>
      <PageTitle
        eyebrow="전국 축제 통합 검색"
        title="취향에 꼭 맞는 축제를"
        highlight="한눈에 발견하세요"
        description="지역과 계절, 가격 조건을 선택해 나에게 꼭 맞는 축제를 쉽고 빠르게 찾아보세요."
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

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="lg:sticky lg:top-24">
              <Card className="gap-0 rounded-3xl bg-white py-0 ring-slate-200">
                <CardContent className="gap-7 p-5 sm:p-6">
                  <div>
                    <h3 className="mb-2 flex items-center gap-1 text-slate-900">
                      <CalendarCheck
                        className="size-4 text-blue-600"
                        aria-hidden="true"
                      />
                      개최 상태
                    </h3>
                    <div className="grid grid-cols-2 gap-1">
                      {statuses.map((item) => (
                        <Button
                          key={item}
                          variant={status === item ? "default" : "outline"}
                          onClick={() => setStatus(item)}
                          className="rounded text-xs"
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center gap-1 text-slate-900">
                      <CircleDollarSign
                        className="size-4 text-blue-600"
                        aria-hidden="true"
                      />
                      가격
                    </h3>
                    <div className="grid grid-cols-3 gap-1">
                      {prices.map((item) => (
                        <Button
                          key={item}
                          type="button"
                          size="sm"
                          variant={price === item ? "default" : "outline"}
                          onClick={() => setPrice(item)}
                          className="rounded px-2 text-xs"
                        >
                          {item.replace("전체 가격", "전체")}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center gap-1 text-slate-900">
                      <CalendarDays
                        className="size-4 text-blue-600"
                        aria-hidden="true"
                      />
                      개최 월
                    </h3>
                    <div className="grid grid-cols-4 gap-1">
                      {months.map((item) => (
                        <Button
                          key={item}
                          type="button"
                          size="sm"
                          variant={month === item ? "default" : "outline"}
                          onClick={() => setMonth(month === item ? null : item)}
                          className="rounded px-1 text-xs"
                        >
                          {item}월
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="min-w-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-cafe24 text-2xl font-bold text-slate-950">
                    전체 축제
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    조건에 맞는 축제{" "}
                    <span className="text-blue-600">
                      {filteredFestivals.length}개
                    </span>
                    가 있습니다.
                  </p>
                </div>
                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value ?? "빠른 개최순")}
                >
                  <SelectTrigger className="h-11 px-4 w-full rounded-xl bg-white sm:w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["빠른 개최순", "이름순", "지역순"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredFestivals.length > 0 ? (
                <div className="mt-7 grid gap-5 xl:grid-cols-2">
                  {filteredFestivals.map((festival) => (
                    <Link
                      key={festival.slug}
                      href={`/festivals/${festival.slug}`}
                      className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                      aria-label={`${festival.title} 상세 보기`}
                    >
                      <Card className="h-full gap-0 overflow-hidden rounded-3xl border-0 bg-white py-0 ring-1 ring-slate-200 transition-all group-hover:-translate-y-1">
                        <CardContent className="min-w-0 gap-4 px-6 pt-4.5 pb-6">
                          <div className="min-w-0">
                            <h3
                              className="truncate font-cafe24 text-3xl leading-tight font-bold text-slate-950"
                              title={festival.title}
                            >
                              {festival.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap gap-1">
                              <Badge
                                variant="outline"
                                className="rounded-full border-blue-200 text-blue-600"
                              >
                                {festival.type}
                              </Badge>
                              <Badge className="rounded-full bg-blue-600 text-white hover:bg-blue-600">
                                {festival.status}
                              </Badge>
                              <Badge variant="outline" className="rounded-full">
                                {festival.price}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                            <div className="relative min-h-40 overflow-hidden rounded bg-slate-200">
                              <PageFestivalImage
                                src={festival.image}
                                alt={`${festival.title} 대표 이미지`}
                                fill
                                sizes="(max-width: 640px) 100vw, 120px"
                                className="object-cover"
                              />
                              <div
                                className="absolute inset-0 grid place-items-center bg-slate-950/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                                aria-hidden="true"
                              >
                                <span className="grid size-11 translate-y-2 place-items-center rounded-full border border-white/70 bg-white/95 text-blue-600 transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none">
                                  <ArrowUpRight className="size-5" />
                                </span>
                              </div>
                            </div>

                            <div className="min-w-0 space-y-2 text-sm text-slate-600">
                              <p className="flex min-w-0 items-start gap-2">
                                <CalendarDays
                                  className="mt-0.5 size-4 shrink-0 text-blue-600"
                                  aria-hidden="true"
                                />
                                <span
                                  className="truncate"
                                  title={`일정 · ${festival.date}`}
                                >
                                  일정 · {festival.date}
                                </span>
                              </p>
                              <p className="flex min-w-0 items-start gap-2">
                                <MapPin
                                  className="mt-0.5 size-4 shrink-0 text-pink-500"
                                  aria-hidden="true"
                                />
                                <span
                                  className="truncate"
                                  title={`장소 · ${festival.region}, ${festival.place}`}
                                >
                                  장소 · {festival.region}, {festival.place}
                                </span>
                              </p>
                              <p className="flex min-w-0 items-start gap-2">
                                <CircleDollarSign
                                  className="mt-0.5 size-4 shrink-0 text-emerald-500"
                                  aria-hidden="true"
                                />
                                <span
                                  className="truncate"
                                  title={`가격 · ${festival.entrance}`}
                                >
                                  가격 · {festival.entrance}
                                </span>
                              </p>
                              <p className="flex min-w-0 items-start gap-2">
                                <TicketCheck
                                  className="mt-0.5 size-4 shrink-0 text-amber-600"
                                  aria-hidden="true"
                                />
                                <span
                                  className="truncate"
                                  title={`티켓 · ${festival.registration}`}
                                >
                                  티켓 · {festival.registration}
                                </span>
                              </p>
                              <p className="flex min-w-0 items-start gap-2">
                                <CarFront
                                  className="mt-0.5 size-4 shrink-0 text-violet-500"
                                  aria-hidden="true"
                                />
                                <span
                                  className="truncate"
                                  title={`주차 · ${festival.parking}`}
                                >
                                  주차 · {festival.parking}
                                </span>
                              </p>
                              <p className="flex min-w-0 items-start gap-2">
                                <ListChecks
                                  className="mt-0.5 size-4 shrink-0 text-cyan-600"
                                  aria-hidden="true"
                                />
                                <span
                                  className="truncate"
                                  title={`프로그램 · ${festival.program}`}
                                >
                                  프로그램 · {festival.program}
                                </span>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card className="mt-7 items-center gap-3 rounded-3xl py-16 text-center ring-slate-200">
                  <div className="grid size-14 place-items-center rounded-full bg-blue-50 text-blue-600">
                    <Search className="size-6" aria-hidden="true" />
                  </div>
                  <h2 className="font-cafe24 text-2xl font-bold">
                    검색 결과가 없어요
                  </h2>
                  <p className="text-sm text-slate-500">
                    다른 검색어나 조건으로 다시 찾아보세요.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                    className="mt-2 rounded-full"
                  >
                    검색 조건 초기화
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
