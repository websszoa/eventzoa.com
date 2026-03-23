import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/lib/types";
import {
  APP_NAME,
  APP_SLOGAN,
  APP_DESCRIPTION,
  APP_SITE_URL,
} from "@/lib/constants";

import DetailHeader from "@/components/detail/detail-header";
import DetailInfo from "@/components/detail/detail-info";
import DetailGallery from "@/components/detail/detail-gallery";
import DetailRegistration from "@/components/detail/detail-registration";
import DetailSns from "@/components/detail/detail-sns";
import DetailMap from "@/components/detail/detail-map";
import DetailComment from "@/components/detail/detail-comment";
import DetailNotice from "@/components/detail/detail-notice";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 메타데이터 설정
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // 데이터 가져오기
  const { data } = await supabase
    .from("events")
    .select("name, description, images")
    .eq("slug", slug)
    .maybeSingle<Pick<Event, "name" | "description" | "images">>();

  // 데이터 없음 → 기본 SEO
  if (!data) {
    return {
      title: `${APP_NAME} | ${APP_SLOGAN}`,
      description: APP_DESCRIPTION,
    };
  }

  // 대표 이미지
  const ogImage = data.images?.cover?.[0] ?? `${APP_SITE_URL}/eventzoa.webp`;

  return {
    title: `${data.name} | ${APP_NAME}`,
    description: data.description ?? APP_DESCRIPTION,

    openGraph: {
      title: `${data.name} | ${APP_NAME}`,
      description: data.description ?? APP_DESCRIPTION,
      images: [ogImage],
      type: "article",
      url: `${APP_SITE_URL}/event/${slug}`,
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 상세 데이터 가져오기
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Event>();

  if (!event) return notFound();

  return (
    <div className="detail__container border-t border-gray-300/20">
      {/* 헤더 */}
      <DetailHeader event={event} />

      <div className="detail__contents space-y-4">
        {/* Row 1: 이벤트 정보(2칸) + 이미지·주최자(1칸) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <DetailInfo event={event} />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-1">
            <DetailGallery event={event} />
          </div>
        </div>

        {/* Row 2: 접수 정보(1칸) + 관련 링크(2칸) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <DetailRegistration event={event} />
          </div>
          <div className="lg:col-span-2">
            <DetailSns event={event} />
          </div>
        </div>

        {/* Row 3:  네이버지도(2칸) + 댓글(1칸) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <DetailMap event={event} clientId={process.env.NAVER_MAP_CLIENT_ID} />
          </div>
          <div className="lg:col-span-1">
            <DetailComment eventId={event.id} />
          </div>
        </div>

        {/* Row 4: 주의사항(전체폭) */}
        <DetailNotice event={event} />
      </div>
    </div>
  );
}
