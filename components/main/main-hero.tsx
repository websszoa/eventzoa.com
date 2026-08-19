import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { siteMenu } from "@/lib/navigation";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  Ticket,
} from "lucide-react";

export default function MainHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071b3b] text-white">
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.38),transparent_32%),radial-gradient(circle_at_20%_100%,rgba(37,99,235,0.24),transparent_36%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-size-[48px_48px] opacity-[0.07]"
        aria-hidden="true"
      />

      <div className="container grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="max-w-2xl">
          <Badge
            variant="outline"
            className="mb-6 h-auto gap-2 rounded-full border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-100 backdrop-blur-sm"
          >
            <Sparkles className="size-4 text-blue-300" aria-hidden="true" />
            오늘의 즐거움을 발견해 보세요
          </Badge>

          <h1 className="font-cafe24 text-5xl leading-[1.2] font-bold tracking-[-0.045em] break-keep sm:text-6xl lg:text-7xl">
            전국의 즐거운 행사를
            <br />
            <span className="text-blue-400">한곳에서 만나요</span>
          </h1>
          <p className="mt-6 max-w-xl font-anyvid text-base leading-7 text-blue-100/70 break-keep sm:text-lg">
            축제부터 공연, 전시, 체험까지. 지금 내 주변에서 열리는 다채로운
            이벤트를 쉽고 빠르게 찾아보세요.
          </p>

          <form
            action="/festivals"
            role="search"
            className="mt-8 flex max-w-xl items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white p-2 shadow-2xl shadow-blue-950/30"
          >
            <Search
              className="ml-3 size-5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <label htmlFor="hero-search" className="sr-only">
              행사 검색
            </label>
            <Input
              id="hero-search"
              name="keyword"
              type="search"
              placeholder="지역, 축제, 행사명을 검색해 보세요"
              className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-1 py-2 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-transparent focus-visible:ring-0 sm:text-base"
            />
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-full bg-blue-600 px-5 font-bold text-white hover:bg-blue-500"
            >
              <span className="hidden sm:inline">검색하기</span>
              <Search className="size-4 sm:hidden" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold text-blue-100/50">
              빠른 탐색
            </span>
            {siteMenu.map((item) => {
              const Icon = item.icon;

              return (
                <Badge
                  key={item.href}
                  variant="outline"
                  render={<Link href={item.href} />}
                  className="h-auto gap-1.5 rounded-full border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-blue-100/80 hover:border-blue-400/40 hover:bg-blue-400/15 hover:text-white"
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {item.label}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-135 lg:mx-0 lg:justify-self-end">
          <div
            className="absolute -top-8 -right-6 size-36 rounded-full bg-blue-500/30 blur-3xl"
            aria-hidden="true"
          />
          <Card className="relative gap-0 overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 py-3 shadow-2xl shadow-black/25 ring-0 backdrop-blur-xl sm:p-4 sm:py-4">
            <div className="relative min-h-97.5 overflow-hidden rounded-[1.5rem] bg-linear-to-br from-blue-500 via-blue-600 to-indigo-800 p-6 sm:min-h-110 sm:p-8">
              <div
                className="absolute -top-20 -right-16 size-64 rounded-full border-42 border-white/10"
                aria-hidden="true"
              />
              <div
                className="absolute right-12 bottom-16 size-28 rotate-12 rounded-3xl bg-cyan-300/20"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-blue-100/70 uppercase">
                    This Week&apos;s Pick
                  </p>
                  <h2 className="mt-3 font-cafe24 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
                    이번 주말,
                    <br />
                    어디로 갈까요?
                  </h2>
                </div>
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-blue-600 shadow-lg">
                  <Ticket className="size-6" aria-hidden="true" />
                </div>
              </div>

              <Card className="absolute inset-x-5 bottom-5 gap-0 rounded-2xl border border-white/20 bg-[#071b3b]/75 py-5 text-white shadow-xl ring-0 backdrop-blur-md sm:inset-x-7 sm:bottom-7">
                <CardContent className="gap-0 px-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Badge className="h-auto rounded-full bg-blue-400/20 px-2.5 py-1 text-[11px] font-bold text-blue-200 hover:bg-blue-400/20">
                        인기 행사
                      </Badge>
                      <h3 className="mt-3 text-lg font-bold sm:text-xl">
                        지금 가장 사랑받는 행사 모음
                      </h3>
                    </div>
                    <CalendarDays
                      className="size-8 shrink-0 text-blue-300"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-blue-100/65 sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      전국 주요 지역
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      매주 새롭게 업데이트
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href="#festivals" />}
                    className="mt-4 h-auto self-start p-0 font-bold text-white hover:bg-transparent hover:text-blue-300"
                  >
                    추천 행사 보기
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Card>

          <Card className="absolute -bottom-5 -left-4 hidden flex-row items-center gap-3 rounded-2xl border border-white/15 bg-white p-4 py-4 text-slate-900 shadow-xl ring-0 sm:flex">
            <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500">오늘 등록된 행사</p>
              <p className="font-bold">새로운 즐거움 24개</p>
            </div>
          </Card>
        </div>
      </div>

      <p className="sr-only">{APP_NAME} 메인 행사 탐색</p>
    </section>
  );
}
