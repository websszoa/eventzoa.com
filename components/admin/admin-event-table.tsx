"use client";

import { Eye, Trophy } from "lucide-react";
import { formatDateRange, getEventProgressStatus } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminEventTable({
  events,
  onEdit,
}: {
  events: Event[];
  onEdit: (event: Event) => void;
}) {
  return (
    <div className="event__table bg-white border rounded-lg overflow-hidden font-anyvid">
      <Table>
        {/* 테이블 헤더 */}
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[50px] text-center">No</TableHead>
            <TableHead>타입</TableHead>
            <TableHead>지역</TableHead>
            <TableHead>이벤트명</TableHead>
            <TableHead className="w-[100px] text-center">상태</TableHead>
            <TableHead className="w-[240px]">기간</TableHead>
            <TableHead className="w-[80px] text-center">관리</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* 빈 상태 */}
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center gap-2">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    등록된 이벤트가 없습니다.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            /* 이벤트 목록 */
            events.map((event, index) => (
              <TableRow key={event.id} className="text-muted-foreground">
                <TableCell className="text-center">
                  {events.length - index}
                </TableCell>
                <TableCell>{event.event_type || "-"}</TableCell>
                <TableCell>{event.region || "-"}</TableCell>
                <TableCell className="font-medium text-foreground">
                  {event.name}
                </TableCell>
                <TableCell className="text-center">
                  {getEventProgressStatus(
                    event.event_start_at,
                    event.event_end_at,
                  )}
                </TableCell>
                <TableCell>
                  <div className="whitespace-normal">
                    {formatDateRange(event.event_start_at, event.event_end_at)}
                  </div>
                </TableCell>
                {/* 수정 버튼 */}
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 font-anyvid bg-gray-100"
                    onClick={() => onEdit(event)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
