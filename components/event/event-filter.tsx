"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  AreaFilter,
  CountryFilter,
  EventStatusFilter,
  MonthFilter,
  PastEventFilter,
  YearFilter,
} from "@/lib/types";

interface EventFilterProps {
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  countryFilter: CountryFilter;
  yearFilter: YearFilter;
  monthFilter: MonthFilter;
  areaFilter: AreaFilter;
  statusFilter: EventStatusFilter;
  pastFilter: PastEventFilter;
  years: number[];
  areas: string[];
  onCountryFilterChange: (value: CountryFilter) => void;
  onYearFilterChange: (value: YearFilter) => void;
  onMonthFilterChange: (value: MonthFilter) => void;
  onAreaFilterChange: (value: AreaFilter) => void;
  onStatusFilterChange: (value: EventStatusFilter) => void;
  onPastFilterChange: (value: PastEventFilter) => void;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function EventFilter({
  isFilterOpen,
  onFilterToggle,
  countryFilter,
  yearFilter,
  monthFilter,
  areaFilter,
  statusFilter,
  pastFilter,
  years,
  areas,
  onCountryFilterChange,
  onYearFilterChange,
  onMonthFilterChange,
  onAreaFilterChange,
  onStatusFilterChange,
  onPastFilterChange,
}: EventFilterProps) {
  return (
    <div className="event__filter">
      {/* 필터 토글 버튼 */}
      <div className="flex justify-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isFilterOpen ? "destructive" : "destructiveOutline"}
              className="h-10 w-10 rounded-full"
              onClick={onFilterToggle}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFilterOpen ? "검색 필터 접기" : "검색 필터 열기"}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* 필터 패널 */}
      {isFilterOpen && (
        <div className="mt-2 space-y-1 rounded border p-4">
          {/* 국가 필터 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <Button
              size="sm"
              variant={countryFilter === "all" ? "destructive" : "outline"}
              onClick={() => onCountryFilterChange("all")}
            >
              전체
            </Button>
            <Button
              size="sm"
              variant={countryFilter === "domestic" ? "destructive" : "outline"}
              onClick={() => onCountryFilterChange("domestic")}
            >
              국내
            </Button>
            <Button
              size="sm"
              variant={
                countryFilter === "international" ? "destructive" : "outline"
              }
              onClick={() => onCountryFilterChange("international")}
            >
              해외
            </Button>
          </div>

          {/* 연도 필터 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <Button
              size="sm"
              variant={yearFilter === "all" ? "destructive" : "outline"}
              onClick={() => onYearFilterChange("all")}
            >
              전체
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                size="sm"
                variant={yearFilter === year ? "destructive" : "outline"}
                onClick={() => onYearFilterChange(year)}
              >
                {year}
              </Button>
            ))}
          </div>

          {/* 월 필터 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <Button
              size="sm"
              variant={monthFilter === "all" ? "destructive" : "outline"}
              onClick={() => onMonthFilterChange("all")}
            >
              전체
            </Button>
            {MONTHS.map((month) => (
              <Button
                key={month}
                size="sm"
                variant={monthFilter === month ? "destructive" : "outline"}
                onClick={() => onMonthFilterChange(month)}
              >
                {month}월
              </Button>
            ))}
          </div>

          {/* 지역 필터 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <Button
              size="sm"
              variant={areaFilter === null ? "destructive" : "outline"}
              onClick={() => onAreaFilterChange(null)}
            >
              전체
            </Button>
            {areas.map((area) => (
              <Button
                key={area}
                size="sm"
                variant={areaFilter === area ? "destructive" : "outline"}
                onClick={() => onAreaFilterChange(area)}
              >
                {area}
              </Button>
            ))}
          </div>

          {/* 진행상태 필터 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <Button
              size="sm"
              variant={statusFilter === "all" ? "destructive" : "outline"}
              onClick={() => onStatusFilterChange("all")}
            >
              전체
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "upcoming" ? "destructive" : "outline"}
              onClick={() => onStatusFilterChange("upcoming")}
            >
              예정
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "ongoing" ? "destructive" : "outline"}
              onClick={() => onStatusFilterChange("ongoing")}
            >
              진행
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "ended" ? "destructive" : "outline"}
              onClick={() => onStatusFilterChange("ended")}
            >
              종료
            </Button>
          </div>

          {/* 지난 이벤트 필터 */}
          <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <Button
              size="sm"
              variant={pastFilter === "exclude" ? "destructive" : "outline"}
              onClick={() => onPastFilterChange("exclude")}
            >
              지난 이벤트 비포함
            </Button>
            <Button
              size="sm"
              variant={pastFilter === "include" ? "destructive" : "outline"}
              onClick={() => onPastFilterChange("include")}
            >
              지난 이벤트 포함
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
