import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import type { EventItem } from "@/lib/types";

export default function EventListImage({ events }: { events: EventItem[] }) {
  return (
    <div className="marathon-list-image">
      {events.map((event) => (
        <Link
          key={event.slug ?? event.id ?? event.name}
          href={`/event/${event.slug}`}
          className="block"
        >
          <article
            key={event.slug ?? event.id ?? event.name}
            className="group relative overflow-hidden rounded-sm border border-slate-100 transition hover:shadow-xl"
          >
            <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
              <img
                src={
                  event.images?.main
                    ? `/events/${event.images.main}`
                    : "/events/no-image.jpg"
                }
                alt={event.name}
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-103 group-hover:brightness-[0.92]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/25 opacity-20 transition duration-300 group-hover:opacity-70" />

              <div className="absolute right-0 top-0 flex items-center gap-1 px-3 py-3 text-xs text-white transition duration-300 group-hover:translate-y-[-6px] group-hover:opacity-0">
                <Badge className="flex items-center gap-1 font-paperlogy font-light text-[10px]">
                  <Eye className="h-3 w-3" /> {event.view_count ?? 0}
                </Badge>
                <Badge className="flex items-center gap-1 font-paperlogy font-light text-[10px]">
                  <Heart className="h-3 w-3" /> {event.like_count ?? 0}
                </Badge>
              </div>

              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/90 via-black/30 to-transparent px-5 pb-6 pt-8 transition duration-400 ease-out group-hover:translate-y-0">
                <h3 className="line-clamp-2 text-center font-paperlogy text-xl font-semibold text-white">
                  {event.name}
                </h3>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
