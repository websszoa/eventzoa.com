import type { Metadata } from "next";

import PageList, { type EventListItem } from "@/components/page/page-list";
import events from "@/data/events/events_2026.json";
import {
  formatEventInfoValue,
  getEventInfoType,
  getEventSite,
} from "@/lib/event-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "전국 축제 리스트",
  description: "지역과 계절, 가격 조건으로 전국 축제를 찾아보세요.",
  path: "/list",
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

function getDDay(startDate: string, today: string) {
  const day = 24 * 60 * 60 * 1000;
  const difference = Math.round(
    (Date.parse(`${startDate}T00:00:00+09:00`) -
      Date.parse(`${today}T00:00:00+09:00`)) /
      day,
  );

  if (difference === 0) return "D-Day";
  return difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
}

export default function ListPage() {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const eventList: EventListItem[] = events.map((event) => {
    const { startDate, endDate } = event.event;
    const schedule = startDate && endDate ? { startDate, endDate } : null;
    const [year = "", month = "", day = ""] = schedule?.startDate.split("-") ?? [];
    const price = formatEventInfoValue(event.info.entrance);

    return {
      slug: event.slug,
      title: event.name,
      description: event.description,
      type: event.info.type,
      region: event.location.region,
      place: event.location.venue,
      season: schedule ? getSeason(Number(month)) : "일정 미정",
      priceType: getEventInfoType(event.info.entrance) || "가격 확인",
      price: price || "가격 확인",
      program: event.info.program || "프로그램 확인",
      status: schedule
        ? getEventStatus(schedule.startDate, schedule.endDate, today)
        : "일정 미정",
      hasSchedule: Boolean(schedule),
      month,
      day,
      weekday: schedule
        ? new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(
            new Date(`${year}-${month}-${day}T00:00:00+09:00`),
          )
        : "",
      dDay: schedule ? getDDay(schedule.startDate, today) : "",
      site: getEventSite(event.info, event.event) || null,
    };
  });

  return <PageList events={eventList} />;
}
