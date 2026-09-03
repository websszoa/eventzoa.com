import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import PageFestivalHeroConfetti from "@/components/page/page-festival-hero-confetti";
import PageFestivalImage from "@/components/page/page-festival-image";
import PageFestivalLocationMap from "@/components/page/page-festival-location-map";
import PageFestivalOrganizer from "@/components/page/page-festival-organizer";
import {
  CalendarClock,
  CalendarDays,
  CarFront,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Info,
  ListChecks,
  MapPin,
  Phone,
  Sparkles,
  TicketCheck,
  type LucideIcon,
} from "lucide-react";

import {
  APP_IMAGE_URL,
  APP_INSTAGRAM_URL,
  APP_NAME,
  APP_SITE_URL,
} from "@/lib/constants";
import {
  formatEventInfoValue,
  getEventInfoType,
  getEventSite,
  getObjectProperty,
} from "@/lib/event-data";
import { getEventCoverPath } from "@/lib/event-image.server";
import {
  festivalSlugs,
  getFestivalBySlug,
} from "@/lib/festival-data.server";
import { createPageMetadata } from "@/lib/seo";

type FestivalPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string | null) {
  if (!date) return "일정 미정";

  const eventDate = new Date(`${date}T00:00:00+09:00`);
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(eventDate);
  const weekday = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(eventDate);

  return `${formattedDate}(${weekday})`;
}

function formatScheduleLabel(label: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(label)) return formatDate(label);
  return label;
}

function formatScheduleTime(value: string) {
  const match = value.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})$/);
  if (!match) return value;

  const [, date, time] = match;
  const eventDate = new Date(`${date}T00:00:00+09:00`);
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(eventDate);

  return `${formattedDate} ${time}`;
}

function getScheduleRows(schedule: Record<string, unknown>) {
  return Object.entries(schedule).flatMap(([time, program]) =>
    Array.isArray(program)
      ? program.map((item, index) => ({
          key: `${time}-${index}`,
          time,
          program: item,
        }))
      : [{ key: time, time, program }],
  );
}

function formatTicketPrice(price: unknown) {
  if (typeof price === "number") return `${price.toLocaleString("ko-KR")}원`;
  return String(price);
}

function formatRegistrationPeriod(
  startDate: string | null,
  endDate: string | null,
  startTime: string | null,
  endTime: string | null,
) {
  const start = startDate
    ? `${formatDate(startDate)}${startTime ? ` ${startTime}` : ""}부터`
    : startTime
      ? `${startTime}부터`
      : "";
  const end = endTime
    ? `${endDate ? `${formatDate(endDate)} ` : ""}${endTime}까지`
    : endDate
      ? `${formatDate(endDate)} 선착순 마감`
      : "선착순 마감";

  return [start, end].filter(Boolean).join(" · ");
}

function getRegistrationStatus(
  startDate: string | null,
  endDate: string | null,
  startTime: string | null,
  endTime: string | null,
) {
  if (!startDate && !endDate) return null;

  const now = new Date();
  const currentDate = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(now);
  const currentTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Seoul",
  }).format(now);
  const currentDateTime = `${currentDate} ${currentTime}`;

  if (
    startDate &&
    currentDateTime < `${startDate} ${startTime || "00:00"}`
  ) {
    return "판매대기";
  }

  if (endDate && currentDateTime > `${endDate} ${endTime || "23:59"}`) {
    return "판매완료";
  }

  return "판매중";
}

function getStatus(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return "일정 미정";

  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  if (today < startDate) return "개최 예정";
  if (today > endDate) return "종료";
  return "진행 중";
}

function getDDay(startDate: string | null) {
  if (!startDate) return "일정 미정";

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
  return festivalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FestivalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);

  if (!festival) return { title: "축제를 찾을 수 없습니다" };

  return createPageMetadata({
    title: festival.name,
    description: festival.description,
    path: `/festivals/${festival.slug}`,
    type: "article",
    image: `${APP_IMAGE_URL}/${festival.slug}.webp`,
  });
}

export default async function FestivalDetailPage({
  params,
}: FestivalPageProps) {
  await connection();

  const { slug } = await params;
  const festival = getFestivalBySlug(slug);

  if (!festival) notFound();

  const { startDate, endDate } = festival.event;
  const status = getStatus(startDate, endDate);
  const coverImage = getEventCoverPath(festival.slug);
  const dDay = getDDay(startDate);
  const date =
    startDate && endDate
      ? startDate === endDate
        ? formatDate(startDate)
        : `${formatDate(startDate)} – ${formatDate(endDate)}`
      : "개최 기간 정보가 없습니다.";
  const { startTime, endTime } = festival.event;
  const time = startTime
    ? endTime
      ? `${startTime} – ${endTime}`
      : `${startTime}부터`
    : endTime
      ? `${endTime}까지`
      : "운영시간 정보가 없습니다.";
  const entrance = formatEventInfoValue(festival.info.entrance);
  const entranceType = getEventInfoType(festival.info.entrance);
  const parking = formatEventInfoValue(festival.info.park);
  const site = getEventSite(festival.info, festival.event);
  const mapSearch =
    festival.location.naver ||
    festival.location.address ||
    festival.location.venue;
  const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(mapSearch)}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(mapSearch)}`;
  const contact = [
    festival.hosts.manager,
    festival.hosts.phone,
    festival.hosts.email,
  ]
    .filter((value): value is string => Boolean(value))
    .join("\n");
  const place = [
    festival.location.region,
    festival.location.area,
    festival.location.venue,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" · ");
  const schedule = getObjectProperty(festival.event, "schedule");
  const groupedScheduleEntries = schedule
    ? Object.entries(schedule).flatMap(([scheduleDate, programs]) =>
        programs && typeof programs === "object"
          ? [[scheduleDate, programs as Record<string, unknown>] as const]
          : [],
      )
    : [];
  const scheduleEntries =
    groupedScheduleEntries.length > 0
      ? groupedScheduleEntries
      : schedule && Object.keys(schedule).length > 0
        ? ([[startDate || "프로그램 일정", schedule]] as const)
        : [];
  const registrationPrice = getObjectProperty(festival.registration, "price");
  const ticketPriceEntries = registrationPrice
    ? Object.entries(registrationPrice).filter(
        ([, price]) => price !== null && price !== undefined && price !== "",
      )
    : [];
  const registrationPeriod = formatRegistrationPeriod(
    festival.registration.startDate,
    festival.registration.endDate,
    festival.registration.startTime,
    festival.registration.endTime,
  );
  const registrationSite = festival.registration.site;
  const registrationStatus = getRegistrationStatus(
    festival.registration.startDate,
    festival.registration.endDate,
    festival.registration.startTime,
    festival.registration.endTime,
  );
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
      value: place || "장소 정보가 없습니다.",
      color: "text-pink-600",
      background: "bg-pink-50",
    },
    {
      icon: CircleDollarSign,
      label: "입장 안내",
      value: entrance || "입장 안내 정보가 없습니다.",
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      icon: CarFront,
      label: "주차",
      value: parking || "주차 정보가 없습니다.",
      color: "text-violet-600",
      background: "bg-violet-50",
    },
    {
      icon: Phone,
      label: "문의처",
      value: contact || "문의처 정보가 없습니다.",
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
        image: [`${APP_IMAGE_URL}/${festival.slug}.webp`],
        startDate,
        endDate,
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
        sameAs: site || undefined,
        ...(entrance === "무료"
          ? {
              offers: {
                "@type": "Offer",
                price: 0,
                priceCurrency: "KRW",
                availability: "https://schema.org/InStock",
                url: site || detailUrl,
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
              {status === "개최 예정"
                ? dDay
                : status === "진행 중"
                  ? "진행중"
                  : status}
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
              {entranceType || "가격 확인"}
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
        <div className="container grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
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
                      className={`flex gap-4 border-slate-100 p-6 sm:p-7 ${index % 2 === 0 ? "sm:border-r" : ""} ${index < summaryItems.length - 2 ? "border-b" : ""}`}
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

            {ticketPriceEntries.length > 0 && (
              <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
                  <h2 className="flex items-center gap-2 font-cafe24 text-2xl font-bold text-slate-950">
                    <TicketCheck
                      className="size-5 text-amber-600"
                      aria-hidden="true"
                    />
                    티켓 가격 정보
                  </h2>
                  {registrationStatus && (
                    <Badge
                      className={`h-7 w-fit shrink-0 rounded-full px-3 font-bold text-white ${
                        registrationStatus === "판매중"
                          ? "bg-blue-600 hover:bg-blue-600"
                          : registrationStatus === "판매대기"
                            ? "bg-amber-500 hover:bg-amber-500"
                            : "bg-slate-500 hover:bg-slate-500"
                      }`}
                    >
                      {registrationStatus}
                    </Badge>
                  )}
                </div>
                <div>
                  {registrationPeriod && (
                    <dl className="flex gap-4 pt-6 px-6 sm:px-7">
                      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                        <CalendarDays className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                          판매 기간
                        </dt>
                        <dd className="mt-2 break-keep text-[15px] leading-6 text-slate-800">
                          {registrationPeriod}
                        </dd>
                        {registrationSite && (
                          <dd className="mt-1">
                            <a
                              href={registrationSite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm underline decoration-violet-200 underline-offset-4 hover:text-violet-500"
                            >
                              판매 사이트 바로가기
                              <ExternalLink
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            </a>
                          </dd>
                        )}
                      </div>
                    </dl>
                  )}
                  <div className="p-6 sm:p-7">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <dl className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-sm">
                        {ticketPriceEntries.map(([name, price]) => (
                          <div
                            key={name}
                            className="grid grid-cols-[max-content_1fr] border-b border-slate-200 last:border-b-0"
                          >
                            <dt className="max-w-64 border-r border-slate-200 px-4 py-3 text-slate-600">
                              {name}
                            </dt>
                            <dd className="px-4 py-3 text-right tabular-nums text-slate-600">
                              {formatTicketPrice(price)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
              <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="flex items-center gap-2 font-cafe24 text-2xl font-bold text-slate-950">
                  <ListChecks
                    className="size-5 text-blue-600"
                    aria-hidden="true"
                  />
                  주요 프로그램
                </h2>
              </div>
              <div className="px-6 py-6 sm:px-7 sm:py-7">
                <p className="break-keep text-[15px] leading-7 text-slate-600">
                  {festival.info.program ||
                    "프로그램은 공식 사이트에서 확인해 주세요."}
                </p>
                {scheduleEntries.length > 0 && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <strong className="flex items-center gap-2 text-sm text-blue-600">
                      <CalendarClock className="size-4" aria-hidden="true" />
                      프로그램 일정
                    </strong>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {scheduleEntries.map(([scheduleDate, schedule]) => {
                        const rows = getScheduleRows(schedule);
                        const hasDatesInRows = rows.some(({ time }) =>
                          /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(time),
                        );

                        return (
                          <div key={scheduleDate}>
                            {scheduleEntries.length > 1 && (
                              <h3 className="mb-3 font-bold text-slate-900">
                                {formatScheduleLabel(scheduleDate)}
                              </h3>
                            )}
                            <ul className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-sm">
                              {rows.map(({ key, time, program }) => (
                                <li
                                  key={key}
                                  className={`grid border-b border-slate-200 last:border-b-0 ${hasDatesInRows ? "grid-cols-[9.5rem_1fr]" : "grid-cols-[5.5rem_1fr]"}`}
                                >
                                  <time className="border-r border-slate-200 px-4 py-3 text-center text-slate-700">
                                    {formatScheduleTime(time)}
                                  </time>
                                  <span className="break-keep px-4 py-3 text-slate-600">
                                    {String(program)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {festival.info.memo && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <strong className="flex items-center gap-2 text-sm font-anyvid text-amber-600">
                      <Info className="size-4" aria-hidden="true" />
                      방문 전 참고사항
                    </strong>
                    <p className="mt-2 break-keep text-sm leading-6 text-slate-600">
                      {festival.info.memo}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <PageFestivalLocationMap
              title={festival.name}
              address={festival.location.address}
              latitude={festival.location.latitude}
              longitude={festival.location.longitude}
              clientId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}
              naverMapUrl={naverMapUrl}
              kakaoMapUrl={kakaoMapUrl}
            />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-3xl p-5 ring-1 ring-slate-200">
              <PageFestivalImage
                src={coverImage}
                alt={`${festival.name} 대표 이미지`}
                width={960}
                height={1280}
                loading="eager"
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
            <PageFestivalOrganizer
              organizer={festival.hosts.organizer}
              manager={festival.hosts.manager}
              sponsor={festival.hosts.sponsor}
              phone={festival.hosts.phone}
              email={festival.hosts.email}
              instagram={festival.hosts.instagram}
              site={site}
            />
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
