import "server-only";

import { getEventInfoType } from "@/lib/event-data";
import { uniqueFestivals, type FestivalData } from "@/lib/festival-data.server";

// 메인 페이지 섹션(진행 중·다가오는 축제)에서 함께 쓰는 축제 데이터 헬퍼.

export type MainFestivalItem = {
  slug: string;
  href: string;
  title: string;
  type: string;
  region: string;
  place: string;
  price: string;
  startDate: string;
  endDate: string;
  /** 11.22 */
  startLabel: string;
  /** 11.22 – 12.03 */
  dateRange: string;
  /** 토 */
  weekday: string;
  /** D-3, D-Day, D+2 (시작일 기준) */
  dDay: string;
  /** 종료일까지 남은 날 (오늘 끝나면 0) */
  daysLeft: number;
  /** 2026-11 */
  monthKey: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function getTodayKst() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}

function toTime(date: string) {
  return Date.parse(`${date}T00:00:00+09:00`);
}

function formatShortDate(date: string) {
  return `${Number(date.slice(5, 7))}.${date.slice(8, 10)}`;
}

function getDDay(startDate: string, today: string) {
  const difference = Math.round((toTime(startDate) - toTime(today)) / DAY_MS);

  if (difference === 0) return "D-Day";
  return difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
}

function toMainFestivalItem(
  festival: FestivalData,
  startDate: string,
  endDate: string,
  today: string,
): MainFestivalItem {
  return {
    slug: festival.slug,
    href: `/festivals/${festival.slug}`,
    title: festival.name,
    type: festival.info.type || "축제",
    region: festival.location.region,
    place: festival.location.venue || festival.location.area || "",
    price: getEventInfoType(festival.info.entrance) || "가격 확인",
    startDate,
    endDate,
    startLabel: formatShortDate(startDate),
    dateRange:
      startDate === endDate
        ? formatShortDate(startDate)
        : `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`,
    weekday: new Intl.DateTimeFormat("ko-KR", {
      weekday: "short",
      timeZone: "Asia/Seoul",
    }).format(new Date(toTime(startDate))),
    dDay: getDDay(startDate, today),
    daysLeft: Math.round((toTime(endDate) - toTime(today)) / DAY_MS),
    monthKey: startDate.slice(0, 7),
  };
}

function getScheduledItems(today: string) {
  return uniqueFestivals.flatMap((festival) => {
    const { startDate, endDate } = festival.event;
    if (!startDate || !endDate) return [];
    return [toMainFestivalItem(festival, startDate, endDate, today)];
  });
}

/** 오늘 열리고 있는 축제 (곧 끝나는 순) */
export function getOngoingFestivals(limit = 4) {
  const today = getTodayKst();

  return getScheduledItems(today)
    .filter(({ startDate, endDate }) => startDate <= today && today <= endDate)
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, limit);
}

/** 아직 시작하지 않은 축제 (빠른 개최순) */
export function getUpcomingFestivals(limit = 8) {
  const today = getTodayKst();

  return getScheduledItems(today)
    .filter(({ startDate }) => startDate > today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}
