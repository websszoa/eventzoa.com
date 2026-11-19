import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MapPin,
} from "lucide-react";

import PageFestivalImage from "@/components/page/page-festival-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventInfoValue, getEventInfoType } from "@/lib/event-data";
import { getEventCoverPath } from "@/lib/event-image.server";
import type { FestivalData } from "@/lib/festival-data.server";

// 카드마다 '자세히 보기' 버튼 색을 돌아가며 쓴다.
const accents = [
  { background: "bg-blue-600", hover: "hover:bg-blue-700" },
  { background: "bg-violet-600", hover: "hover:bg-violet-700" },
  { background: "bg-emerald-600", hover: "hover:bg-emerald-700" },
];

function formatShortDate(value: string) {
  return `${Number(value.slice(5, 7))}.${value.slice(8, 10)}`;
}

function getDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate) return "일정 미정";
  if (!endDate || startDate === endDate) return formatShortDate(startDate);
  return `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
}

function getSchedule(startTime: string | null, endTime: string | null) {
  if (startTime && endTime) return `${startTime}–${endTime}`;
  if (startTime) return `${startTime} 시작`;
  return null;
}

// 메인 '이번 주 놓치면 아쉬운 행사'와 상세페이지 '함께 보면 좋은 축제'가 함께 쓰는 축제 카드
export default function PageFestivalCard({
  festival,
  index = 0,
  eager = false,
}: {
  festival: FestivalData;
  /** 버튼 색 순서 */
  index?: number;
  eager?: boolean;
}) {
  const { startDate, endDate, startTime, endTime } = festival.event;
  const href = `/festivals/${festival.slug}`;
  const image = getEventCoverPath(festival.slug);
  const schedule = getSchedule(startTime, endTime);
  const price =
    getEventInfoType(formatEventInfoValue(festival.info.entrance)) ||
    "가격 확인";
  const location = [festival.location.region, festival.location.area]
    .filter(Boolean)
    .join(" ");
  const accent = accents[index % accents.length];
  const month = startDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "Asia/Seoul",
      })
        .format(new Date(`${startDate}T00:00:00+09:00`))
        .toUpperCase()
    : "TBD";

  return (
    <Card className="group gap-0 overflow-hidden rounded-3xl border-0 bg-white py-0 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-60 overflow-hidden bg-slate-100">
        {image ? (
          <PageFestivalImage
            src={image}
            alt={`${festival.name} 행사 모습`}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-[center_-80px]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-cyan-500 to-sky-300" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/35 via-transparent to-transparent" />
        <Badge className="absolute top-5 left-5 h-auto rounded-full border border-white/20 bg-slate-950/35 px-3 py-1.5 font-bold text-white backdrop-blur-sm hover:bg-slate-950/35">
          {festival.info.type || "축제"}
        </Badge>
        <div className="absolute right-5 bottom-5 flex size-20 flex-col items-center justify-center rounded-2xl bg-white text-slate-950 ring-1 ring-slate-200">
          <span className="font-nanum text-[11px] font-black tracking-widest text-blue-600">
            {month}
          </span>
          <strong className="mb-1.5 font-cafe24 text-4xl leading-none font-black">
            {startDate ? startDate.slice(8, 10) : "-"}
          </strong>
        </div>
      </div>

      <CardHeader className="gap-3 px-6 pt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
          <CalendarDays className="size-4" aria-hidden="true" />
          {getDateRange(startDate, endDate)}
        </div>
        <CardTitle className="line-clamp-2 font-cafe24 text-2xl font-bold tracking-tight text-slate-950">
          {festival.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="gap-3 px-6 pt-2 pb-5">
        <p className="line-clamp-2 min-h-12 font-anyvid text-sm leading-6 break-keep text-slate-500">
          {festival.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin
              className="size-4 shrink-0 text-blue-500"
              aria-hidden="true"
            />
            {location}
          </span>
          <span className="inline-flex items-center gap-1">
            <CircleDollarSign
              className="size-4 shrink-0 text-blue-500"
              aria-hidden="true"
            />
            {price}
          </span>
        </div>
      </CardContent>

      <CardFooter
        className={`${schedule ? "justify-between" : "justify-end"} border-t border-slate-100 px-6 pt-4! pb-4`}
      >
        {schedule && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-800">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {schedule}
          </span>
        )}
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href={href} />}
          className={`rounded-full px-5 text-xs font-bold text-white hover:text-white ${accent.background} ${accent.hover}`}
        >
          자세히 보기
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}
