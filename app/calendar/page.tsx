import type { Metadata } from "next";

import PageCalendar, {
  type CalendarFestival,
} from "@/components/page/page-calendar";
import PageTitle from "@/components/page/page-title";
import events from "@/data/events/events_2026.json";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "축제 캘린더",
  description: `${APP_NAME}에서 전국 축제 일정을 월별·날짜별로 확인하세요.`,
  alternates: { canonical: "/calendar" },
};

export default function CalendarPage() {
  const festivals: CalendarFestival[] = events.map((event) => ({
    slug: event.slug,
    title: event.name,
    startDate: event.event.startDate,
    endDate: event.event.endDate,
    region: event.location.region,
    venue: event.location.venue,
    price: event.info.entrance.type ?? "가격 확인",
  }));

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .split("-");

  return (
    <>
      <PageTitle
        eyebrow="전국 축제 일정 검색"
        title="원하는 날짜의 축제를"
        highlight="한눈에 발견하세요"
        description="전국의 축제 일정을 월별로 살펴보고, 원하는 날짜에 열리는 행사를 빠르게 찾아보세요."
      />

      <PageCalendar
        festivals={festivals}
        initialYear={Number(today[0])}
        initialMonth={Number(today[1])}
      />
    </>
  );
}
