import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Castle,
  Landmark,
  Map,
  MapPin,
  Mountain,
  Palmtree,
  Plane,
  Ship,
  Waves,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { uniqueFestivals } from "@/lib/festival-data.server";

const regions = [
  {
    name: "서울",
    description: "도심 속 전시와 공연",
    includedRegions: ["서울"],
    href: "/festivals",
    icon: Building2,
    theme: "from-blue-700 via-blue-600 to-cyan-400",
    size: "md:col-span-2 md:row-span-2",
    featured: true,
  },
  {
    name: "부산",
    description: "바다와 함께하는 축제",
    includedRegions: ["부산"],
    href: "/festivals",
    icon: Waves,
    theme: "from-cyan-600 to-blue-400",
    size: "",
    featured: false,
  },
  {
    name: "제주",
    description: "자연 속 특별한 체험",
    includedRegions: ["제주"],
    href: "/festivals",
    icon: Palmtree,
    theme: "from-emerald-600 to-teal-400",
    size: "",
    featured: false,
  },
  {
    name: "경기",
    description: "가족과 즐기는 주말",
    includedRegions: ["경기"],
    href: "/festivals",
    icon: MapPin,
    theme: "from-violet-600 to-indigo-400",
    size: "",
    featured: false,
  },
  {
    name: "강원",
    description: "산과 계절이 만든 여행",
    includedRegions: ["강원"],
    href: "/festivals",
    icon: Mountain,
    theme: "from-lime-600 to-emerald-400",
    size: "",
    featured: false,
  },
  {
    name: "전라",
    description: "맛과 멋이 가득한 고장",
    includedRegions: ["전남", "전북", "광주"],
    href: "/festivals",
    icon: Ship,
    theme: "from-orange-600 to-amber-400",
    size: "md:col-span-2 lg:col-span-1",
    featured: false,
  },
  {
    name: "충청",
    description: "여유롭게 만나는 역사와 문화",
    includedRegions: ["충남", "충북", "대전", "세종"],
    href: "/festivals",
    icon: Landmark,
    theme: "from-rose-600 to-pink-400",
    size: "",
    featured: false,
  },
  {
    name: "경상",
    description: "전통과 활기가 만나는 축제",
    includedRegions: ["경남", "경북", "대구", "울산"],
    href: "/festivals",
    icon: Castle,
    theme: "from-red-600 to-orange-400",
    size: "",
    featured: false,
  },
  {
    name: "인천",
    description: "공항과 바다를 잇는 즐거움",
    includedRegions: ["인천"],
    href: "/festivals",
    icon: Plane,
    theme: "from-sky-600 to-indigo-400",
    size: "",
    featured: false,
  },
];

export default function MainRegionEvents() {
  return (
    <section id="performances" className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="secondary"
              className="mb-4 h-auto gap-1.5 rounded-full bg-white px-3 py-1.5 font-bold text-blue-700 ring-1 ring-slate-200"
            >
              <Map className="size-3.5" aria-hidden="true" />
              지역별로 둘러보기
            </Badge>
            <h2 className="font-cafe24 text-4xl leading-tight font-bold tracking-tight text-slate-950 sm:text-5xl">
              가까운 곳의 즐거움을 찾아보세요
            </h2>
            <p className="mt-3 font-anyvid text-sm leading-6 text-slate-500 break-keep sm:text-base">
              내가 있는 지역부터 여행하고 싶은 도시까지, 원하는 곳의 행사를
              빠르게 만나보세요.
            </p>
          </div>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/festivals" />}
            className="self-start rounded-full border-slate-200 bg-white px-5 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:self-auto"
          >
            모든 지역 보기
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-10 grid auto-rows-52 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => {
            const Icon = region.icon;
            const eventCount = uniqueFestivals.filter((festival) =>
              region.includedRegions.includes(festival.location.region),
            ).length;

            return (
              <Card
                key={region.name}
                className={`group relative gap-0 overflow-hidden rounded-3xl border-0 bg-linear-to-br py-0 text-white ring-0 transition-all duration-300 hover:-translate-y-1 ${region.theme} ${region.size}`}
              >
                <div
                  className="absolute -top-12 -right-10 size-40 rounded-full border-26 border-white/10 transition-transform duration-500 group-hover:scale-110"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-14 -left-10 size-36 rounded-full bg-white/10"
                  aria-hidden="true"
                />

                <CardContent
                  className={`relative h-full justify-between p-6 ${region.featured ? "sm:p-8" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <Badge className="h-auto rounded-full border border-white/15 bg-slate-950/15 px-2.5 py-1 text-white backdrop-blur-sm hover:bg-slate-950/15">
                      행사 {eventCount}개
                    </Badge>
                  </div>

                  <div>
                    <p className="font-anyvid text-sm text-white/70">
                      {region.description}
                    </p>
                    <div className="mt-1 flex items-end justify-between gap-3">
                      <h3
                        className={`font-cafe24 font-bold tracking-tight ${region.featured ? "text-5xl sm:text-6xl" : "text-4xl"}`}
                      >
                        {region.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={false}
                        render={<Link href={region.href} />}
                        aria-label={`${region.name} 행사 보기`}
                        className="rounded-full bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
