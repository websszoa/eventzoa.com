"use client";

import { useState } from "react";
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

import AdminEventHeader from "@/components/admin/admin-event-header";
import AdminEventStats from "@/components/admin/admin-event-stats";
import AdminEventFilter from "@/components/admin/admin-event-filter";
import AdminEventSearch from "@/components/admin/admin-event-search";
import AdminEventTable from "@/components/admin/admin-event-table";
import DialogEventAdd from "@/components/dialog/dialog-event-add";
import DialogEventEdit from "@/components/dialog/dialog-event-edit";

export default function AdminEvent({ events }: { events: Event[] }) {
  // 이벤트 목록 상태
  const [eventRows, setEventRows] = useState(events);

  // 다이얼로그 상태
  const [isEventAddOpen, setIsEventAddOpen] = useState(false);
  const [isEventEditOpen, setIsEventEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // 필터 상태
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("all");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("all");
  const [areaFilter, setAreaFilter] = useState<AreaFilter>(null);
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all");
  const [pastFilter, setPastFilter] = useState<PastEventFilter>("include");
  const [searchQuery, setSearchQuery] = useState("");

  // 필터 버튼 렌더링용 연도/지역 목록 추출
  const years = Array.from(
    new Set(eventRows.map((event) => event.year).filter(Boolean)),
  ).sort((a, b) => b - a);

  const areas = Array.from(
    new Set(
      eventRows
        .map((event) => event.region?.trim())
        .filter((region): region is string => Boolean(region)),
    ),
  );

  // 이벤트 진행 상태 계산 (getEventStatus — lib/utils 공유 함수 사용)

  // 필터 적용 (국가 → 연도 → 월 → 지역 → 진행상태 → 지난이벤트 순)
  const filteredEvents = eventRows
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
      if (statusFilter === "all") return true;
      return getEventStatus(event.event_start_at, event.event_end_at) === statusFilter;
    })
    .filter((event) => {
      if (pastFilter === "include") return true;
      return getEventStatus(event.event_start_at, event.event_end_at) !== "ended";
    })
    .filter((event) => {
      // 검색어 필터 (이벤트명, 지역, 장소 대상)
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        event.name?.toLowerCase().includes(q) ||
        event.region?.toLowerCase().includes(q) ||
        event.location?.place?.toLowerCase().includes(q)
      );
    });

  // 이벤트 추가/수정/삭제 핸들러
  const handleAdded = (added: Event) => {
    setEventRows((prev) => [added, ...prev]);
  };

  const handleUpdated = (updated: Event) => {
    setEventRows((prev) =>
      prev.map((event) => (event.id === updated.id ? updated : event)),
    );
    setSelectedEvent(updated);
  };

  const handleDeleted = (id: string) => {
    setEventRows((prev) => prev.filter((event) => event.id !== id));
    setSelectedEvent(null);
  };

  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* header */}
      <AdminEventHeader onOpenChange={setIsEventAddOpen} />

      {/* stats */}
      <AdminEventStats events={filteredEvents} />

      {/* filter */}
      <AdminEventFilter
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

      {/* search */}
      <AdminEventSearch
        totalCount={filteredEvents.length}
        searchQuery={searchQuery}
        countryFilter={countryFilter}
        yearFilter={yearFilter}
        monthFilter={monthFilter}
        areaFilter={areaFilter}
        statusFilter={statusFilter}
        pastFilter={pastFilter}
        onSearchChange={setSearchQuery}
      />

      {/* table */}
      <AdminEventTable
        events={filteredEvents}
        onEdit={(event) => {
          setSelectedEvent(event);
          setIsEventEditOpen(true);
        }}
      />

      <DialogEventEdit
        open={isEventEditOpen}
        onOpenChange={setIsEventEditOpen}
        event={selectedEvent}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />

      <DialogEventAdd
        open={isEventAddOpen}
        onOpenChange={setIsEventAddOpen}
        onAdded={handleAdded}
      />
    </div>
  );
}
