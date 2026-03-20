import Link from "next/link";
import type { Event } from "@/lib/types";
import EventNoData from "./event-no-data";
import { Badge } from "@/components/ui/badge";
import { formatDateRange, getEventDdayInfo } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EventListTable({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <EventNoData />;
  }

  return (
    <div className="event__list__table bg-white border rounded-lg overflow-hidden font-anyvid">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[50px] text-center">No</TableHead>
            <TableHead className="w-[90px] text-center">디데이</TableHead>
            <TableHead className="w-[180px]">날짜</TableHead>
            <TableHead>이벤트명</TableHead>
            <TableHead className="w-[100px]">지역</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => {
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
              <TableRow
                key={event.id}
                className="hover:bg-gray-50 text-muted-foreground"
              >
                {/* 번호 */}
                <TableCell className="text-center text-sm">
                  {events.length - index}
                </TableCell>

                {/* 디데이 */}
                <TableCell className="text-center">
                  {ddayInfo ? (
                    <Badge
                      variant={
                        ddayInfo.label === "종료"
                          ? "red"
                          : ddayInfo.label === "축제중"
                            ? "green"
                            : "destructive"
                      }
                    >
                      {ddayInfo.label}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>

                {/* 날짜 */}
                <TableCell className="text-sm whitespace-nowrap">
                  {dateRange ?? "-"}
                </TableCell>

                {/* 이벤트명 */}
                <TableCell>
                  <Link
                    href={`/event/${event.slug}`}
                    className="hover:underline underline-offset-4 truncate block max-w-xs"
                  >
                    {event.name}
                  </Link>
                </TableCell>

                {/* 지역 */}
                <TableCell className="text-sm">
                  {event.region?.trim() ?? "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
