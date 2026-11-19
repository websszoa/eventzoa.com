"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  History,
  ListChecks,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TicketCheck,
} from "lucide-react";

import PageFestivalImage from "@/components/page/page-festival-image";
import PagePastFestivalLinks from "@/components/page/page-past-festival-links";
import PageTitle from "@/components/page/page-title";
import {
  ALL_PRICE,
  ALL_STATUS,
  DEFAULT_SORT,
  defaultFestivalFilters,
  serializeFestivalFilters,
  type FestivalFilters,
} from "@/lib/festival-filters";
import { normalizeSearchText } from "@/lib/search";

export type FestivalListItem = {
  slug: string;
  title: string;
  description: string;
  region: string;
  type: string;
  season: string;
  month: number | null;
  status: string;
  dDay: string | null;
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

const prices = [ALL_PRICE, "무료", "유료"];
// 버튼을 선택하지 않은 상태("전체")가 기본이며, 선택된 버튼을 다시 누르면 해제된다.
const statuses = [
  { value: "일정 미정", label: "일정 미정" },
  { value: "개최 예정", label: "개최예정" },
  { value: "진행 중", label: "개최중" },
  { value: "종료", label: "개최종료" },
];
const pastOptions = [
  { label: "비포함", value: false },
  { label: "포함", value: true },
];
const statusBadgeLabels: Record<string, string> = {
  "개최 예정": "개최예정",
  "진행 중": "진행중",
};

// 진행 중은 빨강, 개최 예정은 파랑, 그 외(종료·일정 미정)는 회색 계열로 배지를 칠한다.
function getBadgeTone(status: string) {
  if (status === "진행 중") {
    return {
      outline: "border-red-500 text-red-500",
      solid: "border-red-500 bg-red-500 text-white",
    };
  }

  if (status === "개최 예정") {
    return {
      outline: "border-blue-600 text-blue-600",
      solid: "border-blue-600 bg-blue-600 text-white",
    };
  }

  return {
    outline: "border-slate-300 text-slate-600",
    solid: "border-slate-500 bg-slate-500 text-white",
  };
}

const months = Array.from({ length: 12 }, (_, index) => index + 1);
const OVERSEAS_REGION = "해외";

// 한글 지역명(국내)이 아니면 모두 해외로 묶는다.
function getRegionGroup(region: string) {
  return /[가-힣]/.test(region) ? region : OVERSEAS_REGION;
}

export default function PageFestival({
  festivals,
  initialFilters = defaultFestivalFilters,
}: {
  festivals: FestivalListItem[];
  initialFilters?: FestivalFilters;
}) {
  const [keywordInput, setKeywordInput] = useState(initialFilters.keyword);
  const [keyword, setKeyword] = useState(initialFilters.keyword);
  const [selectedRegions, setSelectedRegions] = useState(
    initialFilters.regions,
  );
  const [price, setPrice] = useState(initialFilters.price);
  const [status, setStatus] = useState(initialFilters.status);
  const [includePast, setIncludePast] = useState(initialFilters.includePast);
  const [month, setMonth] = useState(initialFilters.month);
  const [sort, setSort] = useState(initialFilters.sort);
  const regions = useMemo(() => {
    const groups = new Set(
      festivals.map((festival) => getRegionGroup(festival.region)),
    );
    const hasOverseas = groups.delete(OVERSEAS_REGION);

    return [
      "전체 지역",
      ...Array.from(groups).sort((a, b) => a.localeCompare(b, "ko")),
      ...(hasOverseas ? [OVERSEAS_REGION] : []),
    ];
  }, [festivals]);

  const matchingFestivals = useMemo(() => {
    const normalizedKeyword = normalizeSearchText(keyword);

    return festivals
      .filter((festival) => {
        const searchableText = normalizeSearchText(
          [
            festival.title,
            festival.description,
            festival.type,
            festival.region,
            festival.place,
          ].join(" "),
        );
        const matchesKeyword =
          normalizedKeyword.length === 0 ||
          searchableText.includes(normalizedKeyword);
        const matchesRegion =
          selectedRegions.length === 0 ||
          selectedRegions.includes(getRegionGroup(festival.region));
        const matchesPrice = price === ALL_PRICE || festival.price === price;
        const matchesStatus =
          status === ALL_STATUS || festival.status === status;
        const matchesMonth = month === null || festival.month === month;

        return (
          matchesKeyword &&
          matchesRegion &&
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
  }, [festivals, keyword, month, price, selectedRegions, sort, status]);
  const filteredFestivals = useMemo(
    () =>
      includePast
        ? matchingFestivals
        : matchingFestivals.filter((festival) => festival.status !== "종료"),
    [includePast, matchingFestivals],
  );
  const pastFestivals = useMemo(
    () =>
      includePast
        ? []
        : matchingFestivals
            .filter((festival) => festival.status === "종료")
            .map(({ slug, title, date }) => ({ slug, title, date })),
    [includePast, matchingFestivals],
  );

  // 필터를 주소에 반영해 현재 조건 그대로 공유·새로고침할 수 있게 한다.
  useEffect(() => {
    const query = serializeFestivalFilters({
      keyword,
      regions: selectedRegions,
      price,
      status,
      includePast,
      month,
      sort,
    });
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;

    if (
      nextUrl !==
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    ) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [includePast, keyword, month, price, selectedRegions, sort, status]);

  function isRegionSelected(item: string) {
    return item === "전체 지역"
      ? selectedRegions.length === 0
      : selectedRegions.includes(item);
  }

  function toggleRegion(item: string) {
    if (item === "전체 지역") {
      setSelectedRegions([]);
      return;
    }

    setSelectedRegions((current) =>
      current.includes(item)
        ? current.filter((region) => region !== item)
        : [...current, item],
    );
  }

  function changeStatus(selectedStatus: string) {
    const nextStatus = status === selectedStatus ? ALL_STATUS : selectedStatus;

    setStatus(nextStatus);
    // 종료된 축제를 보려면 지난 축제가 목록에 포함되어야 한다.
    if (nextStatus === "종료") setIncludePast(true);
  }

  function changeIncludePast(nextIncludePast: boolean) {
    setIncludePast(nextIncludePast);
    if (!nextIncludePast && status === "종료") setStatus(ALL_STATUS);
  }

  function resetFilters() {
    setKeywordInput("");
    setKeyword("");
    setSelectedRegions([]);
    setPrice(ALL_PRICE);
    setStatus(ALL_STATUS);
    setIncludePast(false);
    setMonth(null);
    setSort(DEFAULT_SORT);
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setKeyword(keywordInput.trim());
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

              <form
                role="search"
                onSubmit={submitSearch}
                className="grid gap-3 lg:grid-cols-[1fr_auto_auto]"
              >
                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    value={keywordInput}
                    onChange={(event) => setKeywordInput(event.target.value)}
                    placeholder="축제명, 지역, 장소 검색"
                    aria-label="축제 검색어"
                    className="h-11! rounded-xl bg-white pr-4 pl-11"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-11! rounded-xl px-5"
                >
                  <Search className="size-4" aria-hidden="true" />
                  검색
                </Button>

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
              </form>
            </CardContent>
          </Card>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="lg:sticky lg:top-24">
              <Card className="gap-0 rounded-3xl bg-white py-0 ring-slate-200">
                <CardContent className="gap-7 p-5 sm:p-6">
                  <div>
                    <h3 className="mb-2 flex items-center gap-1 text-slate-900">
                      <History
                        className="size-4 text-blue-600"
                        aria-hidden="true"
                      />
                      지난 축제
                    </h3>
                    <div className="grid grid-cols-2 gap-1">
                      {pastOptions.map((item) => (
                        <Button
                          key={item.label}
                          type="button"
                          size="sm"
                          variant={
                            includePast === item.value ? "default" : "outline"
                          }
                          aria-pressed={includePast === item.value}
                          onClick={() => changeIncludePast(item.value)}
                          className="rounded px-2 text-xs"
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>

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
                          key={item.value}
                          type="button"
                          size="sm"
                          variant={
                            status === item.value ? "default" : "outline"
                          }
                          aria-pressed={status === item.value}
                          onClick={() => changeStatus(item.value)}
                          className="rounded px-2 text-xs"
                        >
                          {item.label}
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
                      <Button
                        type="button"
                        size="sm"
                        variant={month === null ? "default" : "outline"}
                        aria-pressed={month === null}
                        onClick={() => setMonth(null)}
                        className="rounded px-1 text-xs"
                      >
                        전체
                      </Button>
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

                  <div>
                    <h3 className="mb-2 flex items-center gap-1 text-slate-900">
                      <MapPin
                        className="size-4 text-blue-600"
                        aria-hidden="true"
                      />
                      개최 지역
                    </h3>
                    <div className="grid grid-cols-4 gap-1">
                      {regions.map((item) => (
                        <Button
                          key={item}
                          type="button"
                          size="sm"
                          variant={
                            isRegionSelected(item) ? "default" : "outline"
                          }
                          aria-pressed={isRegionSelected(item)}
                          onClick={() => toggleRegion(item)}
                          className="rounded px-1 text-xs"
                        >
                          {item.replace("전체 지역", "전체")}
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
                  onValueChange={(value) => setSort(value ?? DEFAULT_SORT)}
                >
                  <SelectTrigger className="h-11 px-4 w-full rounded-xl bg-white sm:w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[DEFAULT_SORT, "이름순", "지역순"].map((item) => (
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
                                className={`rounded-full ${getBadgeTone(festival.status).outline}`}
                              >
                                {festival.type}
                              </Badge>
                              {festival.dDay && (
                                <Badge
                                  variant="outline"
                                  className={`rounded-full ${getBadgeTone(festival.status).outline}`}
                                >
                                  {festival.dDay}
                                </Badge>
                              )}
                              <Badge
                                className={`rounded-full ${getBadgeTone(festival.status).solid}`}
                              >
                                {statusBadgeLabels[festival.status] ??
                                  festival.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`rounded-full ${getBadgeTone(festival.status).outline}`}
                              >
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

              <PagePastFestivalLinks festivals={pastFestivals} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
