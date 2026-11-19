import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CalendarHeart,
  HandHeart,
} from "lucide-react";

import DialogNewsletter from "@/components/dialog/dialog-newsletter";
import PageFestivalHeroConfetti from "@/components/page/page-festival-hero-confetti";

// ⑥ 뉴스레터 구독 배너: 배경은 축제 상세페이지 헤더와 같은 그라디언트·애니메이션을 사용한다.
export default function MainNewsletterCta() {
  return (
    <section
      aria-labelledby="main-newsletter-title"
      className="relative overflow-hidden bg-linear-to-br from-sky-50 via-white to-indigo-100"
    >
      <div
        className="festival-hero-orb-one absolute -top-24 right-[8%] size-72 rounded-full bg-blue-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="festival-hero-orb-two absolute -bottom-32 left-[12%] size-80 rounded-full bg-cyan-300/20 blur-3xl"
        aria-hidden="true"
      />
      <PageFestivalHeroConfetti />

      <div className="relative container">
        <div className="flex min-h-80 flex-col items-center justify-center py-12 text-center sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-600 backdrop-blur-sm">
            <BellRing className="size-3.5" aria-hidden="true" />
            EVENTZOA NEWSLETTER
          </p>

          <h2
            id="main-newsletter-title"
            className="mt-6 font-cafe24 text-4xl leading-tight font-bold tracking-tight text-balance text-slate-950 sm:text-5xl"
          >
            축제 소식을 놓치지 마세요!
          </h2>

          <p className="mt-4 text-sm leading-6 break-keep text-slate-500 sm:text-base">
            새로운 축제 일정부터 개최 임박 소식까지, 이벤트조아가 필요한 정보만
            한눈에 정리해 드려요.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 backdrop-blur-sm">
              <CalendarDays
                className="size-3.5 text-blue-500"
                aria-hidden="true"
              />
              새로운 축제 일정
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 backdrop-blur-sm">
              <CalendarHeart
                className="size-3.5 text-pink-500"
                aria-hidden="true"
              />
              개최 임박 알림
            </span>
          </div>

          <DialogNewsletter
            subscriptionSource="메인 구독 배너"
            className="group mt-6 h-11 rounded-full px-6 font-bold transition-all hover:-translate-y-0.5"
          >
            <HandHeart className="size-4" aria-hidden="true" />
            뉴스레터 구독하기
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </DialogNewsletter>
        </div>
      </div>
    </section>
  );
}
