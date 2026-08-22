import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MapPin,
  PartyPopper,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const featuredEvents = [
  {
    category: "축제",
    title: "한강 봄빛 축제",
    description: "강변을 따라 펼쳐지는 음악과 푸드마켓, 야간 조명 축제",
    location: "서울",
    price: "무료",
    schedule: "주말 11:00–21:00",
    date: "4.18 – 4.27",
    day: "18",
    month: "APR",
    href: "/festivals",
    theme: "from-blue-500 via-cyan-500 to-sky-300",
    accent: "bg-blue-600",
  },
  {
    category: "공연",
    title: "도심 재즈 피크닉",
    description: "잔디 위에서 즐기는 라이브 재즈와 감성 가득한 주말",
    location: "부산",
    price: "25,000원",
    schedule: "매일 14:00–20:00",
    date: "5.03 – 5.05",
    day: "03",
    month: "MAY",
    href: "/festivals",
    theme: "from-indigo-600 via-violet-500 to-fuchsia-400",
    accent: "bg-violet-600",
  },
  {
    category: "체험",
    title: "제주 초록 마켓",
    description: "로컬 크리에이터와 함께하는 공예 체험과 자연 친화 마켓",
    location: "제주",
    price: "무료",
    schedule: "주말 10:00–18:00",
    date: "5.10 – 5.18",
    day: "10",
    month: "MAY",
    href: "/festivals",
    theme: "from-emerald-600 via-teal-500 to-lime-300",
    accent: "bg-emerald-600",
  },
];

export default function MainFeaturedEvents() {
  return (
    <section id="festivals" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="secondary"
              className="mb-2 h-auto gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 font-bold text-blue-700"
            >
              <PartyPopper className="size-3.5" aria-hidden="true" />
              지금 인기 있어요
            </Badge>
            <h2 className="font-cafe24 text-4xl leading-tight font-bold tracking-tight text-slate-950 sm:text-5xl">
              이번 주 놓치면 아쉬운 행사
            </h2>
            <p className="mt-3 font-anyvid text-sm leading-6 text-slate-500 break-keep sm:text-base">
              지금 가장 많은 관심을 받고 있는 전국의 행사들을 모았어요.
            </p>
          </div>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/festivals" />}
            className="self-start rounded-full border-slate-200 px-5 font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:self-auto"
          >
            전체 행사 보기
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <Card
              key={event.title}
              className="group gap-0 overflow-hidden rounded-3xl border-0 bg-white py-0 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`relative h-60 overflow-hidden bg-linear-to-br ${event.theme}`}
              >
                <div
                  className="absolute -top-12 -right-10 size-44 rounded-full border-30 border-white/15"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-12 -left-6 size-36 rotate-12 rounded-4xl bg-white/10"
                  aria-hidden="true"
                />
                <Badge className="absolute top-5 left-5 h-auto rounded-full border border-white/20 bg-slate-950/20 px-3 py-1.5 font-bold text-white backdrop-blur-sm hover:bg-slate-950/20">
                  {event.category}
                </Badge>
                <div className="absolute right-5 bottom-5 flex size-20 flex-col items-center justify-center rounded-2xl bg-white text-slate-950 ring-1 ring-slate-200">
                  <span className="text-[11px] font-nanum font-black tracking-widest text-blue-600">
                    {event.month}
                  </span>
                  <strong className="font-cafe24 font-black mb-1.5 text-4xl leading-none">
                    {event.day}
                  </strong>
                </div>
              </div>

              <CardHeader className="gap-3 px-6 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {event.date}
                </div>
                <CardTitle className="font-cafe24 text-2xl font-bold tracking-tight text-slate-950">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="gap-3 px-6 pt-2 pb-5">
                <p className="font-anyvid text-sm leading-6 text-slate-500 break-keep">
                  {event.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin
                      className="size-4 shrink-0 text-blue-500"
                      aria-hidden="true"
                    />
                    {event.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CircleDollarSign
                      className="size-4 shrink-0 text-blue-500"
                      aria-hidden="true"
                    />
                    {event.price}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="justify-between border-t border-slate-100 px-6 pt-4! pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-800">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {event.schedule}
                </span>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href={event.href} />}
                  className={`rounded-full text-xs px-5 font-bold text-white hover:text-white ${event.accent}`}
                >
                  자세히 보기
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
