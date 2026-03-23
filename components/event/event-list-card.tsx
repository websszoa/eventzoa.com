import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_SITE_IMAGE_URL } from "@/lib/constants";
import EventBtnAlarm from "@/components/event/event-btn-alarm";
import EventBtnComment from "@/components/event/event-btn-comment";
import EventBtnFavorite from "@/components/event/event-btn-favorite";
import EventBtnLike from "@/components/event/event-btn-like";
import EventBtnShare from "@/components/event/event-btn-share";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateRange, getEventDdayInfo, getPriceLabel } from "@/lib/utils";
import {
  Building2,
  Calendar,
  CircleDollarSign,
  Eye,
  Fan,
  MapPin,
  NotebookTabs,
  PartyPopper,
} from "lucide-react";

import EventNoData from "./event-no-data";

export default function EventListCard({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <EventNoData />;
  }

  return (
    <div className="event__list__card">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {events.map((event) => {
          const coverImage = event.images?.cover?.[0]
            ? `${APP_SITE_IMAGE_URL}${event.images.cover[0]}`
            : null;
          const priceLabel = getPriceLabel(event.registration_price);
          const ddayInfo = getEventDdayInfo(
            event.event_start_at,
            event.event_end_at,
            event.id,
          );
          const dateRange = formatDateRange(
            event.event_start_at,
            event.event_end_at,
          );

          return (
            <Card
              key={event.id}
              className="flex h-full flex-col justify-between gap-2 border border-gray-200/80 bg-white/90 py-4 transition-all hover:-translate-y-0.5 hover:shadow-lg md:py-6"
            >
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="flex flex-col gap-2 text-xl font-semibold text-slate-900 md:text-2xl font-paperlogy">
                  <Link
                    href={`/event/${event.slug}`}
                    className="min-w-0 flex-8 truncate text-left"
                  >
                    {event.name}
                  </Link>
                  <div className="mb-1 flex items-center gap-1">
                    {ddayInfo && (
                      <>
                        <Badge variant="destructive">{ddayInfo.label}</Badge>
                        <Badge variant="grayLine">{ddayInfo.message}</Badge>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4 px-4 md:px-6">
                <div className="flex gap-3">
                  <Link
                    href={`/event/${event.slug}`}
                    className="relative flex h-[160px] w-[120px] shrink-0 overflow-hidden rounded bg-gray-100"
                  >
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={`${event.name} 행사 포스터`}
                        fill
                        sizes="120px"
                        className="object-cover"
                        loading="eager"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <Fan className="h-6 w-6" aria-hidden="true" />
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="truncate font-anyvid">{dateRange}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-pink-500" />
                      <span className="truncate font-anyvid">
                        {event.region}, {event.location?.place ?? "-"}
                      </span>
                    </div>
                    {priceLabel !== "-" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CircleDollarSign className="h-4 w-4 shrink-0 text-green-500" />
                        <span className="truncate font-anyvid">
                          {priceLabel}
                        </span>
                      </div>
                    )}
                    {event.hosts?.organizer && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0 text-indigo-500" />
                        <span className="truncate font-anyvid">
                          {event.hosts.organizer}
                        </span>
                      </div>
                    )}
                    {event.hosts?.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <NotebookTabs className="h-4 w-4 shrink-0 text-amber-500" />
                        <span className="truncate font-anyvid">
                          {event.hosts.phone}
                        </span>
                      </div>
                    )}
                    {event.event_program && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PartyPopper className="h-4 w-4 shrink-0 text-rose-500" />
                        <span className="truncate font-anyvid">
                          {event.event_program}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-1">
                  <EventBtnShare
                    eventId={event.id}
                    slug={event.slug}
                    name={event.name}
                    description={event.description}
                  />

                  <EventBtnFavorite eventId={event.id} />

                  <EventBtnLike eventId={event.id} />

                  <EventBtnAlarm eventId={event.id} />

                  <EventBtnComment eventId={event.id} />

                  <Button
                    variant="outline"
                    className="group min-w-0 flex-1 text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    asChild
                  >
                    <Link
                      href={`/event/${event.slug}`}
                      className="flex w-full min-w-0 items-center justify-center"
                    >
                      <span
                        className="block truncate group-hover:hidden"
                        aria-hidden="true"
                      >
                        벌써 {event.view_count}명이 봤어요! 🤹‍♂️
                      </span>
                      <span
                        className="hidden min-w-0 items-center gap-1 truncate group-hover:inline-flex"
                        aria-hidden="true"
                      >
                        <Eye className="h-4 w-4" />
                        자세히 보기
                      </span>
                      <span className="sr-only">{event.name} 자세히 보기</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
