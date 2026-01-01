import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatEventDateRange,
  getEventStatus,
  getEventStatusColor,
} from "@/lib/utils";

export default function EventTextList({ events }: { events: EventItem[] }) {
  return (
    <div className="marathon-list-text">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">번호</TableHead>
            <TableHead>대회명</TableHead>
            <TableHead>디데이</TableHead>
            <TableHead>대회 날짜</TableHead>
            <TableHead>장소</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.map((item: any, index: number) => {
            const status = getEventStatus(item.event?.start, item.event?.end);
            const statusColor = getEventStatusColor(status);

            return (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <Link href={`/event/${item.slug}`}>{item.name}</Link>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`font-nanumNeo text-[11px] uppercase tracking-wide ${statusColor}`}
                  >
                    {status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatEventDateRange(item.event.start, item.event.end)}
                </TableCell>
                <TableCell>{item.location?.text || "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
