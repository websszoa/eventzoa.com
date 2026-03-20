"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type {
  AreaFilter,
  CountryFilter,
  EventStatusFilter,
  MonthFilter,
  PastEventFilter,
  YearFilter,
} from "@/lib/types";

export default function AdminEventSearch({
  totalCount,
  searchQuery,
  countryFilter,
  yearFilter,
  monthFilter,
  areaFilter,
  statusFilter,
  pastFilter,
  onSearchChange,
}: {
  totalCount: number;
  searchQuery: string;
  countryFilter: CountryFilter;
  yearFilter: YearFilter;
  monthFilter: MonthFilter;
  areaFilter: AreaFilter;
  statusFilter: EventStatusFilter;
  pastFilter: PastEventFilter;
  onSearchChange: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchChange(inputValue);
    }
  };

  // 활성 필터 조건 레이블 생성
  const activeFilters: string[] = [];
  if (countryFilter === "domestic") activeFilters.push("국내");
  if (countryFilter === "international") activeFilters.push("해외");
  if (yearFilter !== "all") activeFilters.push(`${yearFilter}년`);
  if (monthFilter !== "all") activeFilters.push(`${monthFilter}월`);
  if (areaFilter !== null) activeFilters.push(areaFilter);
  if (statusFilter === "upcoming") activeFilters.push("예정");
  if (statusFilter === "ongoing") activeFilters.push("진행");
  if (statusFilter === "ended") activeFilters.push("종료");
  if (pastFilter === "exclude") activeFilters.push("지난이벤트 비포함");
  if (searchQuery.trim()) activeFilters.push(`검색: ${searchQuery.trim()}`);

  return (
    <div className="event__search__notice grid grid-cols-1 items-stretch gap-2 md:grid-cols-10">
      <div className="md:col-span-3">
        <div className="relative h-full">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="이벤트 검색"
            className="h-full rounded-lg pl-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="font-anyvid flex items-center justify-center rounded-lg border bg-muted/50 p-3 text-center text-sm text-muted-foreground md:col-span-7">
        <p>
          현재 <span className="strong">{totalCount}</span>개의 이벤트가
          있습니다.
          {activeFilters.length > 0 && (
            <span className="ml-2">(필터: {activeFilters.join(", ")})</span>
          )}
        </p>
      </div>
    </div>
  );
}
