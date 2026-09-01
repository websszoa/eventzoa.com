import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MapPin,
  PartyPopper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageFestivalImage from "@/components/page/page-festival-image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventInfoValue, getEventInfoType } from "@/lib/event-data";
import { getEventCoverPath } from "@/lib/event-image.server";
import { uniqueFestivals, type FestivalData } from "@/lib/festival-data.server";

const accents = [
  { background: "bg-blue-600", hover: "hover:bg-blue-700" },
  { background: "bg-violet-600", hover: "hover:bg-violet-700" },
  { background: "bg-emerald-600", hover: "hover:bg-emerald-700" },
];

function formatDateRange(startDate: string, endDate: string) {
  const format = (value: string) =>
    `${Number(value.slice(5, 7))}.${value.slice(8, 10)}`;
  return startDate === endDate
    ? format(startDate)
    : `${format(startDate)} – ${format(endDate)}`;
}

type ScheduledFestival = FestivalData & {
  event: FestivalData["event"] & { startDate: string; endDate: string };
};

function hasSchedule(festival: FestivalData): festival is ScheduledFestival {
  return Boolean(festival.event.startDate && festival.event.endDate);
}

function getFeaturedEvents() {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const scheduled = uniqueFestivals.filter(hasSchedule);
  const upcoming = scheduled
    .filter(({ event }) => event.endDate >= today)
    .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate));
  const recent = scheduled
    .filter(({ event }) => event.endDate < today)
    .sort((a, b) => b.event.endDate.localeCompare(a.event.endDate));

  return [...upcoming, ...recent].slice(0, 3).map((festival, index) => {
    const { startDate, endDate, startTime, endTime } = festival.event;
    const entrance = formatEventInfoValue(festival.info.entrance);

    return {
      category: festival.info.type || "축제",
      title: festival.name,
      description: festival.description,
      location: [festival.location.region, festival.location.area]
        .filter(Boolean)
        .join(" "),
      price: getEventInfoType(entrance) || "가격 확인",
      schedule:
        startTime && endTime
          ? `${startTime}–${endTime}`
          : startTime
            ? `${startTime} 시작`
            : null,
      date: formatDateRange(startDate, endDate),
      day: startDate.slice(8, 10),
      month: new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "Asia/Seoul",
      })
        .format(new Date(`${startDate}T00:00:00+09:00`))
        .toUpperCase(),
      href: `/festivals/${festival.slug}`,
      image: getEventCoverPath(festival.slug),
      accent: accents[index % accents.length],
    };
  });
}

export default function MainFeaturedEvents() {
  const featuredEvents = getFeaturedEvents();

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
            className="self-start rounded-full border-slate-200 px-5 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:self-auto"
          >
            전체 행사 보기
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <Card
              key={event.href}
              className="group gap-0 overflow-hidden rounded-3xl border-0 bg-white py-0 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100">
                {event.image ? (
                  <PageFestivalImage
                    src={event.image}
                    alt={`${event.title} 행사 모습`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-[center_-80px]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-cyan-500 to-sky-300" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/35 via-transparent to-transparent" />
                <Badge className="absolute top-5 left-5 h-auto rounded-full border border-white/20 bg-slate-950/35 px-3 py-1.5 font-bold text-white backdrop-blur-sm hover:bg-slate-950/35">
                  {event.category}
                </Badge>
                <div className="absolute right-5 bottom-5 flex size-20 flex-col items-center justify-center rounded-2xl bg-white text-slate-950 ring-1 ring-slate-200">
                  <span className="font-nanum text-[11px] font-black tracking-widest text-blue-600">
                    {event.month}
                  </span>
                  <strong className="mb-1.5 font-cafe24 text-4xl leading-none font-black">
                    {event.day}
                  </strong>
                </div>
              </div>

              <CardHeader className="gap-3 px-6 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {event.date}
                </div>
                <CardTitle className="line-clamp-2 font-cafe24 text-2xl font-bold tracking-tight text-slate-950">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="gap-3 px-6 pt-2 pb-5">
                <p className="line-clamp-2 min-h-12 font-anyvid text-sm leading-6 text-slate-500 break-keep">
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

              <CardFooter
                className={`${event.schedule ? "justify-between" : "justify-end"} border-t border-slate-100 px-6 pt-4! pb-4`}
              >
                {event.schedule && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-800">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {event.schedule}
                  </span>
                )}
                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href={event.href} />}
                  className={`rounded-full px-5 text-xs font-bold text-white hover:text-white ${event.accent.background} ${event.accent.hover}`}
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
