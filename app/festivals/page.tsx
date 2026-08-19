import type { Metadata } from "next";

import PageFestival, {
  type FestivalListItem,
} from "@/components/page/page-festival";

import events from "@/data/events/events_2026.json";

export const metadata: Metadata = {
  title: "전국 축제 찾기",
  description: "지역과 계절, 가격 조건으로 전국의 다양한 축제를 검색해보세요.",
};

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

function formatDateRange(startDate: string, endDate: string) {
  const format = (date: string) => date.replaceAll("-", ".");
  return startDate === endDate
    ? format(startDate)
    : `${format(startDate)} – ${format(endDate)}`;
}

export default function FestivalsPage() {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());

  const festivals: FestivalListItem[] = events.map((event) => {
    const month = Number(event.event.startDate.slice(5, 7));
    const parking = [event.info.park.type, event.info.park.fee]
      .filter(Boolean)
      .join(" · ");

    return {
      slug: event.slug,
      title: event.name,
      description: event.description,
      region: event.location.region,
      season: getSeason(month),
      month,
      status: getEventStatus(event.event.startDate, event.event.endDate, today),
      price: event.info.entrance.type ?? "가격 확인",
      date: formatDateRange(event.event.startDate, event.event.endDate),
      startDate: event.event.startDate,
      place: event.location.venue,
      parking: parking || "정보 확인",
      program: event.info.program || "정보 확인",
      image: `/event/cover/${event.slug}.jpg`,
      site: event.event.site,
    };
  });

  return <PageFestival festivals={festivals} />;
}
