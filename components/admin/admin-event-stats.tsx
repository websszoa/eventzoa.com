"use client";

import { useMemo } from "react";
import type { Event } from "@/lib/types";
import { getEventStatus } from "@/lib/utils";

export default function AdminEventStats({ events }: { events: Event[] }) {
  // 이벤트를 한 번만 순회해 상태별 카운트를 계산
  const { totalCount, scheduledCount, ongoingCount, endedCount } = useMemo(() => {
    const counts = { scheduledCount: 0, ongoingCount: 0, endedCount: 0 };
    for (const event of events) {
      const status = getEventStatus(event.event_start_at, event.event_end_at);
      if (status === "upcoming") counts.scheduledCount++;
      else if (status === "ongoing") counts.ongoingCount++;
      else if (status === "ended") counts.endedCount++;
    }
    return { totalCount: events.length, ...counts };
  }, [events]);

  return (
    <div className="event__stats grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* 전체 */}
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm font-paperlogy text-muted-foreground">
          전체 이벤트
        </p>
        <p className="text-2xl font-paperlogy font-semibold">{totalCount}</p>
      </div>
      {/* 예정 */}
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm font-paperlogy text-muted-foreground">예정</p>
        <p className="text-2xl font-paperlogy font-semibold text-blue-600">
          {scheduledCount}
        </p>
      </div>
      {/* 진행중 */}
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm font-paperlogy text-muted-foreground">진행중</p>
        <p className="text-2xl font-paperlogy font-semibold text-green-600">
          {ongoingCount}
        </p>
      </div>
      {/* 종료 */}
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm font-paperlogy text-muted-foreground">종료</p>
        <p className="text-2xl font-paperlogy font-semibold text-yellow-600">
          {endedCount}
        </p>
      </div>
    </div>
  );
}
