"use client";

import { Grid, CalendarHeart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ViewMode = "card" | "table";

interface EventSearchBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function EventSearchBar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  viewMode,
  onViewModeChange,
}: EventSearchBarProps) {
  return (
    <div className="event__search__bar">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* 검색 입력 (Enter 또는 버튼 클릭 시 검색) */}
        <form
          className="relative flex w-full flex-col gap-2 sm:w-80 sm:flex-row sm:gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <div className="flex w-full items-center gap-2">
            <Input
              id="event-search"
              aria-label="이벤트 검색"
              placeholder="이벤트명 검색"
              className="h-10 w-full"
              value={searchInput}
              maxLength={100}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearchSubmit();
                }
              }}
            />
            <Button
              type="submit"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">검색</span>
            </Button>
          </div>
        </form>

        {/* 보기 방식 선택 (카드형 / 테이블형) */}
        <div className="mt-2 flex w-full justify-center gap-1 sm:mt-0 sm:w-auto sm:justify-start">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={
                  viewMode === "card" ? "destructive" : "destructiveOutline"
                }
                className="h-10 w-10 rounded-full"
                onClick={() => onViewModeChange("card")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>카드형</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={
                  viewMode === "table" ? "destructive" : "destructiveOutline"
                }
                className="h-10 w-10 rounded-full"
                onClick={() => onViewModeChange("table")}
              >
                <CalendarHeart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>테이블형</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
