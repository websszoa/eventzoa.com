"use client";

import { useEffect, useState } from "react";
import { getEventStatus } from "@/lib/utils";
import type {
  AreaFilter,
  CountryFilter,
  Event,
  EventStatusFilter,
  MonthFilter,
  PastEventFilter,
  YearFilter,
} from "@/lib/types";

import EventTitle from "./event-title";
import EventFilter from "./event-filter";
import EventListCard from "./event-list-card";
import EventListTable from "./event-list-table";
import EventNotice from "./event-notice";
import EventSearchBar from "./event-search-bar";

export default function EventMain({ events }: { events: Event[] }) {
  // 필터 상태
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("all");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("all");
  const [areaFilter, setAreaFilter] = useState<AreaFilter>(null);
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all");
  const [pastFilter, setPastFilter] = useState<PastEventFilter>("exclude");

  // 클라이언트 마운트 여부 (getEventStatus는 new Date() 사용 → SSR/CSR 불일치 방지)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 검색 상태 (입력값은 live, 적용값은 Enter/버튼 시)
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 보기 방식 (카드형 / 테이블형)
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // 필터 패널 열림/닫힘
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 필터 버튼 렌더링용 연도/지역 목록 추출
  const years = Array.from(
    new Set(events.map((e) => e.year).filter(Boolean)),
  ).sort((a, b) => b - a);

  const areas = Array.from(
    new Set(
      events
        .map((e) => e.region?.trim())
        .filter((r): r is string => Boolean(r)),
    ),
  );

  // 필터 적용 (국가 → 연도 → 월 → 지역 → 진행상태 → 지난이벤트 → 검색어 순)
  const filteredEvents = events
    .filter((event) => {
      if (countryFilter === "all") return true;
      const isDomestic = event.country?.trim() === "한국";
      if (countryFilter === "domestic") return isDomestic;
      return !isDomestic;
    })
    .filter((event) => {
      if (yearFilter === "all") return true;
      return event.year === yearFilter;
    })
    .filter((event) => {
      if (monthFilter === "all") return true;
      return event.month === monthFilter;
    })
    .filter((event) => {
      if (areaFilter === null) return true;
      return event.region?.trim() === areaFilter;
    })
    .filter((event) => {
      if (!mounted || statusFilter === "all") return true;
      return (
        getEventStatus(event.event_start_at, event.event_end_at) ===
        statusFilter
      );
    })
    .filter((event) => {
      if (!mounted || pastFilter === "include") return true;
      return (
        getEventStatus(event.event_start_at, event.event_end_at) !== "ended"
      );
    })
    .filter((event) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        event.name?.toLowerCase().includes(q) ||
        event.region?.toLowerCase().includes(q) ||
        event.location?.place?.toLowerCase().includes(q)
      );
    });

  return (
    <>
      {/* 타이틀 */}
      <EventTitle />

      {/* 필터 */}
      <EventFilter
        isFilterOpen={isFilterOpen}
        onFilterToggle={() => setIsFilterOpen((prev) => !prev)}
        countryFilter={countryFilter}
        yearFilter={yearFilter}
        monthFilter={monthFilter}
        areaFilter={areaFilter}
        statusFilter={statusFilter}
        pastFilter={pastFilter}
        years={years}
        areas={areas}
        onCountryFilterChange={setCountryFilter}
        onYearFilterChange={setYearFilter}
        onMonthFilterChange={setMonthFilter}
        onAreaFilterChange={setAreaFilter}
        onStatusFilterChange={setStatusFilter}
        onPastFilterChange={setPastFilter}
      />

      {/* 결과 안내 */}
      <EventNotice
        totalCount={filteredEvents.length}
        countryFilter={countryFilter}
        yearFilter={yearFilter}
        monthFilter={monthFilter}
        areaFilter={areaFilter}
        statusFilter={statusFilter}
        pastFilter={pastFilter}
        searchQuery={searchQuery}
      />

      {/* 검색 + 보기방식 */}
      <EventSearchBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={() => setSearchQuery(searchInput)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 이벤트 목록 */}
      {viewMode === "card" ? (
        <EventListCard events={filteredEvents} />
      ) : (
        <EventListTable events={filteredEvents} />
      )}
    </>
  );
}
