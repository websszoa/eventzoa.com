"use client";

import { Search, Blinds, Grid, Aperture, BookImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";

interface Props {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;

  viewMode: "card" | "text" | "image";
  setViewMode: (mode: "card" | "text" | "image") => void;
}

export default function EventSearchBar({
  inputValue,
  onInputChange,
  onSubmit,
  viewMode,
  setViewMode,
}: Props) {
  return (
    <div className="event__search">
      {/* 검색영역 */}
      <form
        className="relative flex w-full flex-col gap-2 sm:w-80 sm:flex-row sm:gap-4"
        onSubmit={onSubmit}
      >
        <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="이벤트명 검색"
          className="h-10 w-full pl-9 sm:mr-2"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
      </form>

      {/* 셀렉터 */}
      <div className="w-full sm:w-auto flex justify-end gap-1 sm:justify-start mt-2 sm:mt-0">
        <Button
          onClick={() => setViewMode("card")}
          className={`w-10 h-10 ${
            viewMode === "card"
              ? "bg-blue-700 text-white"
              : "border-blue-50 bg-blue-50 text-blue-600"
          }`}
        >
          <Grid className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => setViewMode("text")}
          className={`w-10 h-10 ${
            viewMode === "text"
              ? "bg-blue-700 text-white"
              : "border-blue-50 bg-blue-50 text-blue-600"
          }`}
        >
          <Blinds className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => setViewMode("image")}
          className={`w-10 h-10 ${
            viewMode === "image"
              ? "bg-blue-700 text-white"
              : "border-blue-50 bg-blue-50 text-blue-600"
          }`}
        >
          <BookImage className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
