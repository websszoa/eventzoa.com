import { PartyPopper } from "lucide-react";

import MainSectionHeader from "@/components/main/main-section-header";
import PageFestivalCard from "@/components/page/page-festival-card";
import { uniqueFestivals } from "@/lib/festival-data.server";

// 진행 중·개최 예정 축제를 가까운 일정 순으로, 모자라면 최근에 끝난 축제로 채운다.
function getFeaturedEvents() {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const scheduled = uniqueFestivals.filter(
    ({ event }) => event.startDate && event.endDate,
  );
  const upcoming = scheduled
    .filter(({ event }) => event.endDate! >= today)
    .sort((a, b) => a.event.startDate!.localeCompare(b.event.startDate!));
  const recent = scheduled
    .filter(({ event }) => event.endDate! < today)
    .sort((a, b) => b.event.endDate!.localeCompare(a.event.endDate!));

  return [...upcoming, ...recent].slice(0, 3);
}

export default function MainFeaturedEvents() {
  const featuredEvents = getFeaturedEvents();

  return (
    <section id="festivals" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <MainSectionHeader
          icon={PartyPopper}
          eyebrow="지금 인기 있어요"
          title="이번 주 놓치면 아쉬운 행사"
          description="지금 가장 많은 관심을 받고 있는 전국의 행사들을 모았어요."
          action={{ href: "/festivals", label: "전체 행사 보기" }}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((festival, index) => (
            <PageFestivalCard
              key={festival.slug}
              festival={festival}
              index={index}
              eager={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
