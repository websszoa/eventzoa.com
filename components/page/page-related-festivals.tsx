import { Compass } from "lucide-react";

import MainSectionHeader from "@/components/main/main-section-header";
import PageFestivalCard from "@/components/page/page-festival-card";
import { getFestivalsHref } from "@/lib/festival-filters";
import {
  getRelatedFestivals,
  type FestivalData,
} from "@/lib/festival-data.server";

// 상세페이지 하단 내부 링크: 같은 지역·같은 종류의 축제로 이어 준다.
// 디자인은 메인 '이번 주 놓치면 아쉬운 행사'와 같다.
export default function PageRelatedFestivals({
  festival,
}: {
  festival: FestivalData;
}) {
  const related = getRelatedFestivals(festival, 3);

  if (related.length === 0) return null;

  const region = festival.location.region;

  return (
    <section
      aria-label="함께 보면 좋은 축제"
      className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <MainSectionHeader
          icon={Compass}
          eyebrow="더 둘러보기"
          title="함께 보면 좋은 축제"
          description={`${region ? `${region} 지역과 ` : ""}비슷한 종류의 축제를 모았어요.`}
          action={
            region
              ? {
                  href: getFestivalsHref({ regions: [region] }),
                  label: `${region} 축제 더보기`,
                }
              : { href: "/festivals", label: "전체 행사 보기" }
          }
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map(({ festival: item }, index) => (
            <PageFestivalCard key={item.slug} festival={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
