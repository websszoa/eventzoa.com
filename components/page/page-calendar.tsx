"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarFestival = {
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  region: string;
  venue: string;
  price: string;
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatRange(startDate: string, endDate: string) {
  const format = (value: string) => value.replaceAll("-", ".");
  return startDate === endDate
    ? format(startDate)
    : `${format(startDate)} – ${format(endDate)}`;
}

export default function PageCalendar({
  festivals,
  initialYear,
  initialMonth,
  todayDate,
}: {
  festivals: CalendarFestival[];
  initialYear: number;
  initialMonth: number;
  todayDate: string;
}) {
  const [cursor, setCursor] = useState({
    year: initialYear,
    month: initialMonth - 1,
  });
  const [region, setRegion] = useState("전체");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const regions = useMemo(
    () => [
      "전체",
      ...Array.from(new Set(festivals.map((item) => item.region))).sort(),
    ],
    [festivals],
  );
  const filteredFestivals = useMemo(
    () =>
      region === "전체"
        ? festivals
        : festivals.filter((item) => item.region === region),
    [festivals, region],
  );
  const firstWeekday = new Date(
    Date.UTC(cursor.year, cursor.month, 1),
  ).getUTCDay();
  const daysInMonth = new Date(
    Date.UTC(cursor.year, cursor.month + 1, 0),
  ).getUTCDate();
  const calendarDays = Array.from(
    { length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7 },
    (_, index) => {
      const day = index - firstWeekday + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    },
  );
  const monthlyFestivals = filteredFestivals.filter((festival) => {
    const monthStart = toDateKey(cursor.year, cursor.month, 1);
    const monthEnd = toDateKey(cursor.year, cursor.month, daysInMonth);
    return festival.startDate <= monthEnd && festival.endDate >= monthStart;
  });
  const selectedFestivals = selectedDate
    ? filteredFestivals.filter(
        (festival) =>
          festival.startDate <= selectedDate &&
          festival.endDate >= selectedDate,
      )
    : monthlyFestivals;

  const moveMonth = (amount: number) => {
    const next = new Date(Date.UTC(cursor.year, cursor.month + amount, 1));
    setCursor({ year: next.getUTCFullYear(), month: next.getUTCMonth() });
    setSelectedDate(null);
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-600">월간 축제 일정</p>
            <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950 sm:text-4xl">
              날짜별로 축제를 찾아보세요
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              날짜를 선택하면 그날 열리는 축제를 한눈에 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <span>지역</span>
            <Select
              value={region}
              onValueChange={(value) => {
                setRegion(value ?? "전체");
                setSelectedDate(null);
              }}
            >
              <SelectTrigger className="h-11! min-w-36 rounded-xl bg-white px-4 font-normal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item === "전체" ? "전체 지역" : item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 overflow-hidden rounded-t-3xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-7">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                aria-label="이전 달"
              >
                <ChevronLeft className="size-5" />
              </button>
              <div className="text-center">
                <h3 className="font-cafe24 text-3xl font-bold pb-2 text-slate-950">
                  {cursor.year}년 {cursor.month + 1}월
                </h3>
              </div>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                aria-label="다음 달"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-175">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                  {weekdays.map((weekday, index) => (
                    <div
                      key={weekday}
                      className={`py-3 text-center text-xs font-bold ${index === 0 ? "text-red-500" : index === 6 ? "text-blue-600" : "text-slate-500"}`}
                    >
                      {weekday}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-32 border-r border-b border-slate-100 bg-slate-50/50"
                        />
                      );
                    }

                    const dateKey = toDateKey(cursor.year, cursor.month, day);
                    const dayFestivals = filteredFestivals.filter(
                      (festival) =>
                        festival.startDate <= dateKey &&
                        festival.endDate >= dateKey,
                    );
                    const isSelected = selectedDate === dateKey;
                    const isToday = todayDate === dateKey;

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => setSelectedDate(dateKey)}
                        className={`min-h-32 border-r border-b border-slate-100 p-2 text-left align-top transition-colors hover:bg-blue-50/60 ${isSelected ? "bg-blue-50 ring-2 ring-inset ring-blue-500" : isToday ? "bg-blue-50/40 ring-1 ring-inset ring-blue-300" : "bg-white"}`}
                        aria-pressed={isSelected}
                        aria-current={isToday ? "date" : undefined}
                        aria-label={`${cursor.month + 1}월 ${day}일${isToday ? ", 오늘" : ""}, 축제 ${dayFestivals.length}개`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span
                            className={`grid size-8 place-items-center rounded-full text-sm font-bold ${isSelected || isToday ? "bg-blue-600 text-white" : index % 7 === 0 ? "text-red-500" : index % 7 === 6 ? "text-blue-600" : "text-slate-700"}`}
                          >
                            {day}
                          </span>
                          {isToday && (
                            <span className="pr-1 text-[10px] font-bold text-blue-600">
                              오늘
                            </span>
                          )}
                        </span>
                        <span className="mt-2 block space-y-1">
                          {dayFestivals.slice(0, 2).map((festival) => (
                            <span
                              key={festival.slug}
                              className="block truncate rounded-md bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700"
                            >
                              {festival.title}
                            </span>
                          ))}
                          {dayFestivals.length > 2 && (
                            <span className="block px-1 text-[11px] font-bold text-slate-400">
                              +{dayFestivals.length - 2}개 더보기
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 xl:sticky xl:top-28">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-sm font-bold text-blue-600">
                  {selectedDate
                    ? `${Number(selectedDate.slice(5, 7))}월 ${Number(selectedDate.slice(8, 10))}일`
                    : `${cursor.month + 1}월 전체`}
                </p>
                <h3 className="mt-1 font-cafe24 text-2xl font-bold text-slate-950">
                  축제 {selectedFestivals.length}개
                </h3>
              </div>
              <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays className="size-5" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-2 max-h-150 divide-y divide-slate-100 overflow-y-auto">
              {selectedFestivals.length > 0 ? (
                selectedFestivals.map((festival) => (
                  <Link
                    key={festival.slug}
                    href={`/festivals/${festival.slug}`}
                    className="group block py-5"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                      <span>{festival.region}</span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="text-slate-500">{festival.price}</span>
                    </div>
                    <h4 className="mt-2 break-keep font-cafe24 text-xl font-bold text-slate-950 transition-colors group-hover:text-blue-600">
                      {festival.title}
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {formatRange(festival.startDate, festival.endDate)}
                    </p>
                    <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                      <MapPin
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{festival.venue}</span>
                    </p>
                  </Link>
                ))
              ) : (
                <div className="py-14 text-center">
                  <CalendarDays
                    className="mx-auto size-8 text-slate-300"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm text-slate-500">
                    등록된 축제가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
