import type { Metadata } from "next";
import { Mail } from "lucide-react";

import ContactForm from "@/components/page/page-contact-form";
import { APP_NAME } from "@/lib/constants";
import { inquiryTypes, type InquiryType } from "@/lib/contact";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "문의하기",
  description: `${APP_NAME} 행사 등록, 정보 수정 및 서비스 이용 문의를 안내합니다.`,
  path: "/contact",
});

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
          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <div className="mb-6">
              <p className="text-sm font-bold text-blue-600">고객지원</p>
              <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">
                문의 전 확인해 주세요
              </h2>
              <p className="mt-3 break-keep text-sm leading-6 text-slate-500">
                정확한 내용을 남겨주시면 확인 후 더욱 빠르게 안내해 드릴 수 있습니다.
              </p>
            </div>
          </aside>
          <div className="min-w-0">
            <ContactForm key={initialType} initialType={initialType} />
          </div>
        </div>
      </section>
    </>
  );
}
