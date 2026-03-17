"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Hamburger } from "lucide-react";

export default function PageAbout() {
  return (
    <div className="space-y-4">
      {/* 상단 소개 */}
      <div className="rounded-2xl font-anyvid border border-dashed border-gray-200 p-4 md:p-8">
        <section className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
            <Image
              src="/eventzoa.webp"
              alt={`${APP_NAME} 소개 이미지`}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground break-keep">
            <h3 className="font-paperlogy text-2xl text-slate-900">
              안녕하세요! {APP_NAME}입니다.
            </h3>

            <p>
              <strong>{APP_NAME}</strong>는 국내외 다양한 행사와 축제, 이벤트
              정보를 한 곳에서 쉽게 확인할 수 있도록 정리해 제공하는
              서비스입니다. 지역, 기간, 유형 등 다양한 기준으로 이벤트를 탐색할
              수 있도록 구성해 원하는 행사를 빠르게 찾을 수 있도록 돕습니다.
            </p>

            <p>
              흩어져 있는 행사 정보를 한눈에 확인할 수 있도록 정리하고, 관심
              있는 이벤트를 저장해 두고 언제든 다시 확인할 수 있도록
              구성했습니다. {APP_NAME}는 더 많은 사람들이 다양한 행사와 이벤트를
              쉽고 편리하게 발견할 수 있도록 지속적으로 서비스를 개선해
              나가겠습니다. 이용 중 궁금한 점이나 추가되었으면 하는 행사 정보가
              있다면 언제든 문의사항으로 남겨주세요.
            </p>

            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-anyvid text-muted-foreground hover:text-red-500"
              >
                <Hamburger className="w-4 h-4" />
                문의사항 / 이벤트 제보하기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
