import type { Metadata } from "next";
import { getEventCoverPath } from "@/lib/event-image.server";
import { createPageMetadata } from "@/lib/seo";
import PageFestival, {
  type FestivalListItem,
} from "@/components/page/page-festival";
import {
  formatEventInfoValue,
  getEventInfoType,
  getEventSite,
} from "@/lib/event-data";

import events from "@/data/events/events_2026.json";

export const metadata: Metadata = createPageMetadata({
  title: "전국 축제 찾기",
  description: "지역과 계절, 가격 조건으로 전국의 다양한 축제를 검색해보세요.",
  path: "/festivals",
});

function getSeason(month: number) {
  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  if (month >= 9 && month <= 11) return "가을";
  return "겨울";
}

function getEventStatus(startDate: string, endDate: string, today: string) {
  if (today < startDate) return "개최 예정";
  if (today > endDate) return "종료";
  return "진행 중";
}

function getEventStatusLabel(
  startDate: string,
  endDate: string,
  today: string,
) {
  if (today > endDate) return "종료";
  if (today >= startDate) return "진행중";

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const difference = Math.round(
    (Date.parse(`${startDate}T00:00:00+09:00`) -
      Date.parse(`${today}T00:00:00+09:00`)) /
      millisecondsPerDay,
  );

  return `D-${difference}`;
}

function formatDateRange(startDate: string, endDate: string) {
  const format = (date: string) => {
    const weekday = new Intl.DateTimeFormat("ko-KR", {
      weekday: "short",
      timeZone: "Asia/Seoul",
    }).format(new Date(`${date}T00:00:00+09:00`));

    return `${date.replaceAll("-", ".")}(${weekday})`;
  };

  return startDate === endDate
    ? format(startDate)
    : `${format(startDate)} – ${format(endDate)}`;
}

export default async function FestivalsPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string | string[] }>;
}) {
  const { keyword } = await searchParams;
  const initialKeyword = Array.isArray(keyword) ? keyword[0] : keyword;
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const uniqueEvents = events.filter(
    (event, index) =>
      events.findIndex((candidate) => candidate.slug === event.slug) === index,
  );

  const festivals: FestivalListItem[] = uniqueEvents.map((event) => {
    const { startDate, endDate } = event.event;
    const hasSchedule =
      typeof startDate === "string" && typeof endDate === "string";
    const month = hasSchedule ? Number(startDate.slice(5, 7)) : null;
    const parking = formatEventInfoValue(event.info.park)
      .split(",")[0]
      ?.trim();
    const entrance = formatEventInfoValue(event.info.entrance);
    const entranceSummary = entrance
      .split(",")
      .slice(0, 2)
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");

    return {
      slug: event.slug,
      title: event.name,
      description: event.description,
      region: event.location.region,
      type: event.info.type || "축제",
      season: month === null ? "일정 미정" : getSeason(month),
      month,
      status: hasSchedule
        ? getEventStatus(startDate, endDate, today)
        : "일정 미정",
      statusLabel: hasSchedule
        ? getEventStatusLabel(startDate, endDate, today)
        : "일정 미정",
      price: getEventInfoType(event.info.entrance) || "가격 확인",
      entrance: entranceSummary || "가격 확인",
      registration: event.registration.status || "접수 정보 확인",
      date: hasSchedule ? formatDateRange(startDate, endDate) : "일정 미정",
      startDate,
      place: event.location.venue || "장소 확인",
      parking: parking || "정보 확인",
      program: event.info.program || "정보 확인",
      image: getEventCoverPath(event.slug) || "",
      site: getEventSite(event.info, event.event) || null,
    };
  });

  return (
    <PageFestival
      festivals={festivals}
      initialKeyword={initialKeyword?.trim() || ""}
    />
  );
}
