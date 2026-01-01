import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { EventItem } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Star,
  CircleDollarSign,
  Building2,
} from "lucide-react";
import {
  formatEventDate,
  getEventStatus,
  getEventStatusColor,
} from "@/lib/utils";

export default function EventListCard({ events }: { events: EventItem[] }) {
  return (
    <div className="marathon-list-card">
      {events.map((item) => {
        const status = getEventStatus(
          item.event?.start ?? "",
          item.event?.end ?? ""
        );
        const statusColor = getEventStatusColor(status);

        return (
          <Card
            key={item.id}
            className="flex gap-2 h-full flex-col justify-between border-slate-200/80 bg-white/90 py-4 transition hover:-translate-y-0.5 hover:shadow-lg md:py-6"
          >
            <CardHeader className="px-4 md:px-6">
              <div className="flex items-start justify-between">
                <CardTitle className="flex-1 text-left font-paperlogy text-lg font-bold text-slate-900 md:text-2xl">
                  <Link href={`/event/${item.slug}`}>{item.name}</Link>
                </CardTitle>

                <Badge
                  className={`font-nanumNeo text-[11px] uppercase tracking-wide ${statusColor}`}
                >
                  {status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col gap-4 px-4 md:px-6">
              <div className="flex gap-3">
                <div className="flex h-[140px] w-[110px] overflow-hidden rounded">
                  <img
                    src={`/events/${item.images?.main}`}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  {item.event?.start && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="truncate font-nanumNeo">
                        {formatEventDate(item.event.start, item.event.end)}
                      </span>
                    </div>
                  )}

                  {item.location?.text && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
                      <span className="truncate font-nanumNeo">
                        {item.location.text}
                      </span>
                    </div>
                  )}

                  {item.event?.time && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Star className="h-4 w-4 shrink-0 text-amber-500" />
                      <span className="truncate font-nanumNeo">
                        {item.event.time}
                      </span>
                    </div>
                  )}

                  {item.event?.price && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CircleDollarSign className="h-4 w-4 shrink-0 text-green-500" />
                      <span className="truncate font-nanumNeo">
                        {item.event.price}
                      </span>
                    </div>
                  )}

                  {item.hosts?.organizer && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="h-4 w-4 shrink-0 text-pink-500" />
                      <span className="truncate font-nanumNeo">
                        {item.hosts.organizer}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              <div className="mt-auto flex">
                <Button
                  size="lg"
                  className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Link href={`/event/${item.slug}`} className="block w-full">
                    자세히 보기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
