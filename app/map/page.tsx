import type { Metadata } from "next";

import PageMap, { type MapFestival } from "@/components/page/page-map";
import PageTitle from "@/components/page/page-title";
import events from "@/data/events/events_2026.json";
import { APP_NAME } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "전국 축제 지도",
  description: `${APP_NAME}에서 전국 축제의 위치와 일정을 지도로 확인하세요.`,
  path: "/map",
});

export default function MapPage() {
  const festivals: MapFestival[] = events.flatMap((event) => {
    const startDate = event.event.startDate;

    if (
      !startDate ||
      event.location.latitude === null ||
      event.location.longitude === null
    ) {
      return [];
    }

    return [{
      slug: event.slug,
      title: event.name,
      region: event.location.region,
      venue: event.location.venue,
      startDate,
      endDate: event.event.endDate ?? startDate,
      latitude: event.location.latitude,
      longitude: event.location.longitude,
    }];
  });

  return (
    <>
      <PageTitle
        eyebrow="전국 축제 위치 검색"
        title="가까운 축제를 지도에서"
        highlight="한눈에 발견하세요"
        description="전국 곳곳에서 열리는 축제의 위치를 살펴보고, 원하는 지역의 행사를 빠르게 찾아보세요."
      />
      <PageMap
        festivals={festivals}
        clientId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}
      />
    </>
  );
}
