import type { Metadata } from "next";
import Link from "next/link";
import {
  CircleHelp,
  Mail,
  Megaphone,
  PenLine,
  Pencil,
  TriangleAlert,
} from "lucide-react";

import ContactForm from "@/components/page/page-contact-form";
import { APP_NAME } from "@/lib/constants";
import { inquiryTypes, type InquiryType } from "@/lib/contact";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "문의하기",
  description: `${APP_NAME} 행사 등록, 정보 수정, 광고 및 서비스 이용 문의를 안내합니다.`,
  path: "/contact",
});

const inquiryCards = [
  { type: "general", icon: CircleHelp, title: "문의사항", description: "서비스 이용과 관련한 일반적인 내용을 문의해 주세요." },
  { type: "registration", icon: PenLine, title: "등록문의", description: "새로운 축제나 행사의 등록을 요청해 주세요." },
  { type: "correction", icon: Pencil, title: "수정요청", description: "일정, 장소 등 기존 행사 정보의 수정을 요청해 주세요." },
  { type: "report", icon: TriangleAlert, title: "불편신고", description: "오류나 잘못된 링크 등 이용 중 불편을 알려주세요." },
  { type: "advertising", icon: Megaphone, title: "광고 문의", description: "축제와 브랜드를 알리기 위한 광고 상품을 문의해 주세요." },
] satisfies Array<{
  type: InquiryType;
  icon: typeof PenLine;
  title: string;
  description: string;
}>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const requestedType = (await searchParams).type;
  const initialType: InquiryType = inquiryTypes.includes(
    requestedType as InquiryType,
  )
    ? (requestedType as InquiryType)
    : "general";

  return (
    <>
      <section className="bg-linear-to-br from-sky-50 via-blue-50/40 to-white">
        <div className="container py-14 sm:py-18 lg:py-16">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-200"><Mail className="size-6" aria-hidden="true" /></div>
          <p className="mt-6 text-sm font-bold tracking-widest text-blue-600 uppercase">Contact Us</p>
          <h1 className="mt-2 font-cafe24 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">문의하기</h1>
          <p className="mt-5 break-keep text-[15px] leading-7 text-slate-600">궁금한 점이나 제안이 있다면 편하게 알려주세요. 내용을 확인한 뒤 순서대로 답변드리겠습니다.</p>
        </div>
      </section>
      <section className="bg-white py-12 sm:py-16">
        <div className="container grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:sticky lg:top-28">
            <div className="mb-6">
              <p className="text-sm font-bold text-blue-600">고객지원</p>
              <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">
                어떤 도움이 필요하신가요?
              </h2>
              <p className="mt-3 break-keep text-sm leading-6 text-slate-500">
                필요한 항목을 선택하고 오른쪽에서 내용을 작성해 주세요.
              </p>
            </div>
            <nav
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
              aria-label="문의 유형"
            >
              {inquiryCards.map(({ type, icon: Icon, title, description }) => {
                const isActive = initialType === type;

                return (
                  <Link
                    key={type}
                    href={`/contact?type=${type}#inquiry-form`}
                    aria-current={isActive ? "page" : undefined}
                    className={`group rounded-2xl border p-5 transition-all ${isActive ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors ${isActive ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-white"}`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-cafe24 text-xl font-bold text-slate-950">
                          {title}
                        </h3>
                        <p className="mt-1 break-keep text-xs leading-5 text-slate-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>
          <div className="min-w-0">
            <ContactForm key={initialType} initialType={initialType} />
          </div>
        </div>
      </section>
    </>
  );
}
