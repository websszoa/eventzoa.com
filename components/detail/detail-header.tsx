import type { Event } from "@/lib/types";

export default function DetailHeader({ event }: { event: Event }) {
  return (
    <div className="detail__header flex flex-col md:flex-row md:items-start justify-between gap-4 md:border md:border-t-3 md:border-t-brand p-0 md:p-6 rounded-2xl mb-8 md:mb-4 mt-4">
      {/* 왼쪽 제목 + 설명 */}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-paperlogy font-semibold mb-1">
          {event.name}
        </h2>
        <p className="text-muted-foreground font-anyvid text-sm break-keep">
          {event.description}
        </p>
      </div>
    </div>
  );
}
