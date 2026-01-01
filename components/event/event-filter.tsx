"use client";

import { Button } from "@/components/ui/button";
import { MessageSquareMore, Settings, Instagram } from "lucide-react";
import { APP_INSTAGRAM_URL, APP_KAKAO_URL } from "@/lib/constants";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface EventFilterProps {
  showFilter: boolean;
  onToggleFilter: () => void;
  year: number | null;
  month: number | null;
  region: string;
  onYearChange: (year: number | null) => void;
  onMonthChange: (month: number | null) => void;
  onRegionChange: (region: string) => void;
}

export default function EventFilter({
  showFilter,
  onToggleFilter,
  year,
  month,
  region,
  onYearChange,
  onMonthChange,
  onRegionChange,
}: EventFilterProps) {
  return (
    <div className="event__filter">
      {/* 필터 버튼 */}
      <div className="flex gap-1 justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onToggleFilter}
              className={`w-10 h-10 transition rounded-full ${
                showFilter
                  ? "bg-brand border-brand text-white"
                  : "border-blue-100 bg-blue-50 text-brand"
              }`}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>검색 필터</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-10 h-10 transition rounded-full border-blue-100 bg-blue-50 text-brand"
              onClick={() =>
                window.open(APP_KAKAO_URL, "_blank", "noopener,noreferrer")
              }
            >
              <MessageSquareMore className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>오픈채팅</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-10 h-10 transition rounded-full border-blue-100 bg-blue-50 text-brand"
              onClick={() =>
                window.open(APP_INSTAGRAM_URL, "_blank", "noopener,noreferrer")
              }
            >
              <Instagram className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>인스타그램</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* 필터 내용 */}
      {showFilter && (
        <div className="border p-4 rounded mt-2">
          {/* 연도 */}
          <div className="grid grid-cols-6 sm:grid-cols-13 gap-2 mb-2">
            <Button
              size="sm"
              className={year === null ? "bg-blue-700 text-white" : ""}
              onClick={() => onYearChange(null)}
            >
              전체
            </Button>
            <Button
              size="sm"
              className={year === 2025 ? "bg-blue-700 text-white" : ""}
              onClick={() => onYearChange(2025)}
            >
              2025
            </Button>
            <Button
              size="sm"
              className={year === 2026 ? "bg-blue-700 text-white" : ""}
              onClick={() => onYearChange(2026)}
            >
              2026
            </Button>
          </div>

          {/* 월 */}
          <div className="grid grid-cols-7 sm:grid-cols-13 gap-2 mb-2">
            <Button
              size="sm"
              className={month === null ? "bg-blue-700 text-white" : ""}
              onClick={() => onMonthChange(null)}
            >
              전체
            </Button>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <Button
                key={m}
                size="sm"
                className={month === m ? "bg-blue-700 text-white" : ""}
                onClick={() => onMonthChange(m)}
              >
                {m}월
              </Button>
            ))}
          </div>

          {/* 지역 */}
          <div className="grid grid-cols-7 sm:grid-cols-13 gap-2">
            <Button
              size="sm"
              className={region === "" ? "bg-blue-700 text-white" : ""}
              onClick={() => onRegionChange("")}
            >
              전국
            </Button>

            {[
              "서울",
              "부산",
              "대구",
              "인천",
              "광주",
              "대전",
              "울산",
              "세종",
              "경기",
              "강원",
              "충북",
              "충남",
              "전북",
              "전남",
              "경북",
              "경남",
              "제주",
            ].map((r) => (
              <Button
                key={r}
                size="sm"
                className={region === r ? "bg-blue-700 text-white" : ""}
                onClick={() => onRegionChange(r)}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
