import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import PageFestivalHeroConfetti from "@/components/page/page-festival-hero-confetti";
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  ListChecks,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import events from "@/data/events/events_2026.json";
import { APP_INSTAGRAM_URL, APP_NAME, APP_SITE_URL } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

type FestivalPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(`${date}T00:00:00+09:00`));
}

function formatTime(time: string | null) {
  if (!time || time === "00:00")
    return "운영 시간은 공식 사이트에서 확인해 주세요";
  return time;
}

function getStatus(startDate: string, endDate: string) {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  if (today < startDate) return "개최 예정";
  if (today > endDate) return "종료";
  return "진행 중";
}

function getDDay(startDate: string) {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const difference = Math.round(
    (Date.parse(`${startDate}T00:00:00+09:00`) -
      Date.parse(`${today}T00:00:00+09:00`)) /
      millisecondsPerDay,
  );

  if (difference === 0) return "D-Day";
  return difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
}

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: FestivalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const festival = events.find((event) => event.slug === slug);

  if (!festival) return { title: "축제를 찾을 수 없습니다" };

  return createPageMetadata({
    title: festival.name,
    description: festival.description,
    path: `/festivals/${festival.slug}`,
    type: "article",
    image: `/event/cover/${festival.slug}.jpg`,
  });
}

export default async function FestivalDetailPage({
  params,
}: FestivalPageProps) {
  const { slug } = await params;
  const festival = events.find((event) => event.slug === slug);

  if (!festival) notFound();

  const status = getStatus(festival.event.startDate, festival.event.endDate);
  const dDay = getDDay(festival.event.startDate);
  const date = `${formatDate(festival.event.startDate)} – ${formatDate(festival.event.endDate)}`;
  const time =
    festival.event.startTime === "00:00" && festival.event.endTime === "00:00"
      ? formatTime(null)
      : `${formatTime(festival.event.startTime)} – ${formatTime(festival.event.endTime)}`;
  const parking = [festival.info.park.type, festival.info.park.fee]
    .filter(Boolean)
    .join(" · ");
  const mapUrl = `https://map.naver.com/p/search/${encodeURIComponent(festival.location.naver || festival.location.address || festival.location.venue)}`;
  const priceEntries = festival.registration.price
    ? Object.entries(festival.registration.price)
    : [];
  const summaryItems: Array<{
    icon: LucideIcon;
    label: string;
    value: string;
    color: string;
    background: string;
  }> = [
    {
      icon: CalendarDays,
      label: "개최 기간",
      value: date,
      color: "text-blue-600",
      background: "bg-blue-50",
    },
    {
      icon: Clock3,
      label: "운영 시간",
      value: time,
      color: "text-amber-600",
      background: "bg-amber-50",
    },
    {
      icon: MapPin,
      label: "장소",
      value: `${festival.location.venue}\n${festival.location.address}`,
      color: "text-pink-600",
      background: "bg-pink-50",
    },
    {
      icon: CircleDollarSign,
      label: "입장 안내",
      value:
        festival.info.entrance.fee ||
        festival.info.entrance.type ||
        "정보 확인",
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      icon: CarFront,
      label: "주차",
      value: parking || "정보 확인",
      color: "text-violet-600",
      background: "bg-violet-50",
    },
    {
      icon: UserRound,
      label: "주최",
      value: festival.hosts.organizer || "정보 확인",
      color: "text-cyan-700",
      background: "bg-cyan-50",
    },
  ];

  const detailUrl = `${APP_SITE_URL}/festivals/${festival.slug}`;
  const eventSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
    "@type": "Event",
    "@id": `${detailUrl}/#event`,
    name: festival.name,
    description: festival.description,
    image: [`${APP_SITE_URL}/event/cover/${festival.slug}.jpg`],
    startDate: festival.event.startDate,
    endDate: festival.event.endDate,
    eventStatus:
      status === "종료"
        ? "https://schema.org/EventCompleted"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: festival.location.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: festival.location.address,
        addressLocality: festival.location.area,
        addressRegion: festival.location.region,
        addressCountry: "KR",
      },
      ...(festival.location.latitude !== null &&
      festival.location.longitude !== null
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: festival.location.latitude,
              longitude: festival.location.longitude,
            },
          }
        : {}),
    },
    organizer: festival.hosts.organizer
      ? { "@type": "Organization", name: festival.hosts.organizer }
      : { "@type": "Organization", name: APP_NAME },
    url: detailUrl,
    sameAs: festival.event.site || undefined,
    ...(festival.info.entrance.type === "무료"
      ? {
          offers: {
            "@type": "Offer",
            price: 0,
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
            url: festival.event.site || detailUrl,
          },
        }
      : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "홈",
            item: APP_SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "축제 찾기",
            item: `${APP_SITE_URL}/festivals`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: festival.name,
            item: detailUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-br from-sky-50 via-white to-indigo-100">
        <div
          className="festival-hero-orb-one absolute -top-24 right-[8%] size-72 rounded-full bg-blue-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="festival-hero-orb-two absolute -bottom-32 left-[12%] size-80 rounded-full bg-cyan-300/20 blur-3xl"
          aria-hidden="true"
        />
        <PageFestivalHeroConfetti />
        <div className="container relative py-14 sm:py-18 lg:py-22">
          <div className="festival-hero-reveal flex flex-wrap gap-2">
            <Badge className="rounded-full bg-blue-600 px-3 text-white">
              {status}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-blue-200 bg-white/70 px-3 text-blue-700"
            >
              {festival.location.region} · {festival.info.type}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-blue-200 bg-white/70 px-3 text-blue-700"
            >
              {festival.info.entrance.type}
            </Badge>
          </div>
          <h1 className="festival-hero-reveal mt-2 break-keep font-cafe24 text-4xl leading-tight font-bold text-slate-950 [animation-delay:120ms] sm:text-5xl lg:text-6xl">
            {festival.name}
          </h1>
          <p className="festival-hero-reveal mt-5 break-keep text-[15px] leading-6.5 text-slate-600 [animation-delay:220ms]">
            {festival.description}
          </p>
          <div className="festival-hero-reveal mt-6 flex flex-col gap-3 text-sm text-slate-700 [animation-delay:320ms] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <p className="flex items-start gap-2">
              <CalendarDays
                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <span>{date}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-rose-500"
                aria-hidden="true"
              />
              <span className="break-keep">{festival.location.venue}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-16">
        <div className="container grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <div className="space-y-7">
            <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
              <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="flex items-center gap-2 font-cafe24 text-2xl font-bold text-slate-950">
                  <Sparkles
                    className="size-5 text-amber-500"
                    aria-hidden="true"
                  />
                  축제 정보
                </h2>
                <Badge className="h-7 w-fit rounded-full bg-blue-600 px-3 font-bold text-white">
                  {dDay}
                </Badge>
              </div>

              <dl className="grid sm:grid-cols-2">
                {summaryItems.map(
                  ({ icon: Icon, label, value, color, background }, index) => (
                    <div
                      key={label}
                      className={`flex min-h-32 gap-4 border-slate-100 p-6 sm:p-7 ${index % 2 === 0 ? "sm:border-r" : ""} ${index < summaryItems.length - 2 ? "border-b" : ""}`}
                    >
                      <div
                        className={`grid size-11 shrink-0 place-items-center rounded-2xl ${background} ${color}`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                          {label}
                        </dt>
                        <dd className="mt-2 whitespace-pre-line break-keep text-[15px] leading-6 text-slate-800">
                          {value}
                        </dd>
                      </div>
                    </div>
                  ),
                )}
              </dl>
            </section>

            <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 text-white sm:px-8 sm:py-10">
              <div
                className="absolute -right-16 -bottom-24 size-64 rounded-full bg-blue-500/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-white/10 text-blue-300">
                    <ListChecks className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-blue-300 uppercase">
                      Program
                    </p>
                    <h2 className="mt-1 font-cafe24 text-3xl font-bold">
                      주요 프로그램
                    </h2>
                  </div>
                </div>
                <p className="mt-7 max-w-3xl break-keep text-base leading-8 text-slate-200">
                  {festival.info.program ||
                    "프로그램은 공식 사이트에서 확인해 주세요."}
                </p>
                {festival.info.memo && (
                  <div className="mt-7 border-t border-white/10 pt-6">
                    <strong className="text-sm text-blue-300">
                      방문 전 참고사항
                    </strong>
                    <p className="mt-2 break-keep text-sm leading-6 text-slate-300">
                      {festival.info.memo}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {priceEntries.length > 0 && (
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase">
                      Ticket
                    </p>
                    <h2 className="mt-1 font-cafe24 text-3xl font-bold text-slate-950">
                      입장 요금
                    </h2>
                  </div>
                  <CircleDollarSign
                    className="size-7 text-emerald-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {priceEntries.map(([name, price]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-2xl bg-emerald-50/70 px-5 py-4 text-sm"
                    >
                      <span className="text-slate-600">{name}</span>
                      <strong className="text-slate-950">{price}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-3xl p-4 ring-1 ring-slate-200">
              <Image
                src={`/event/cover/${festival.slug}.jpg`}
                alt={`${festival.name} 대표 이미지`}
                width={960}
                height={1280}
                priority
                sizes="(max-width: 1024px) 100vw, 340px"
                className="h-auto w-full rounded-xl"
              />
              <a
                href={APP_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-7 right-7 grid size-10 place-items-center opacity-90 transition-opacity hover:opacity-100"
                aria-label="이벤트조아 인스타그램 새 창에서 열기"
              >
                <Image
                  src="/icons/instagram.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="brightness-0 invert"
                  aria-hidden="true"
                />
              </a>
            </div>
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <p className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                Location
              </p>
              <h2 className="mt-1 font-cafe24 text-2xl font-bold text-slate-950">
                방문 정보
              </h2>
              <p className="mt-4 break-keep text-sm leading-6 text-slate-600">
                {festival.location.address}
              </p>
              <div className="mt-5 grid gap-2">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants(), "h-12 rounded-xl")}
                >
                  <Navigation className="size-4" />
                  지도에서 위치 보기
                </a>
                {festival.event.site && (
                  <a
                    href={festival.event.site}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-12 rounded-xl",
                    )}
                  >
                    공식 사이트
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </section>
            {(festival.hosts.phone || festival.hosts.manager) && (
              <section className="rounded-3xl bg-blue-50 p-6 ring-1 ring-blue-100">
                <p className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                  Contact
                </p>
                <h2 className="mt-1 font-cafe24 text-2xl font-bold text-slate-950">
                  문의처
                </h2>
                {festival.hosts.manager && (
                  <p className="mt-4 text-sm text-slate-600">
                    {festival.hosts.manager}
                  </p>
                )}
                {festival.hosts.phone && (
                  <a
                    href={`tel:${festival.hosts.phone}`}
                    className="mt-3 flex items-center gap-2 font-bold text-blue-600 hover:underline"
                  >
                    <Phone className="size-4" />
                    {festival.hosts.phone}
                  </a>
                )}
              </section>
            )}
            <Link
              href="/festivals"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full rounded-xl text-slate-600",
              )}
            >
              <ArrowLeft className="size-4" />
              축제 목록으로 돌아가기
            </Link>
          </aside>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
