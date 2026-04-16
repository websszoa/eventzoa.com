import {
  ClipboardList,
  Calendar,
  Crown,
  Footprints,
  Asterisk,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

const REGISTRATION_STATUS_VARIANT: Record<
  string,
  "default" | "destructive" | "secondary" | "outline"
> = {
  접수대기: "outline",
  접수중: "destructive",
  접수마감: "secondary",
  추가접수: "default",
};

export default function DetailRegistration({ event }: { event: Event }) {
  const {
    registration_status,
    registration_start_at,
    registration_end_at,
    registration_add_start_at,
    registration_add_end_at,
    registration_price,
  } = event;

  const regPeriod = formatDateRange(registration_start_at, registration_end_at);
  const addPeriod = formatDateRange(
    registration_add_start_at,
    registration_add_end_at,
  );
  const hasPrices = registration_price && registration_price.length > 0;
  const isEmpty = !registration_status && regPeriod === "-" && !hasPrices;
  const registrationStartLabel = registration_start_at
    ? formatDateTimeOptional(registration_start_at)
    : null;
  const registrationEndLabel = registration_end_at
    ? formatDateTimeOptional(registration_end_at)
    : "(선착순마감)";

  return (
    <div className="detail__registration detail__box">
      <div className="detail__header">
        <ClipboardList />
        <h3>가격 정보</h3>
        {registration_status && (
          <div className="ml-auto">
            <Badge
              variant={
                REGISTRATION_STATUS_VARIANT[registration_status] ?? "outline"
              }
            >
              {registration_status}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6">
        {isEmpty ? (
          <div className="text-center text-gray-500 text-sm font-nanumNeo border border-dashed rounded m-4">
            <div className="p-4 md:p-6">
              <Crown className="w-7 h-7 text-brand/20 mx-auto mb-2" />
              <p>가격 정보가 없습니다.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-anyvid text-sm text-muted-foreground">
            {regPeriod !== "-" && (
              <div className="space-y-0.5 break-keep">
                <p className="flex items-center gap-1">
                  <Asterisk className="h-4 w-4 text-red-400" />
                  접수 시작 : {registrationStartLabel}
                </p>
                <p className="flex items-center gap-1">
                  <Asterisk className="h-4 w-4 text-blue-400" />
                  접수 마감 : {registrationEndLabel}
                </p>
              </div>
            )}

            {addPeriod !== "-" && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-xs font-medium">추가 접수</span>
                </div>
                <p className="break-keep pl-5 text-slate-800">{addPeriod}</p>
              </div>
            )}

            {hasPrices && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th
                        scope="col"
                        className="px-3 py-2 text-left font-medium text-muted-foreground"
                      >
                        <Footprints className="mr-1 inline h-3 w-3" />
                        구분
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-right font-medium text-muted-foreground"
                      >
                        금액
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registration_price.map((item, i) => (
                      <tr
                        key={`${item.distance}-${i}`}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-3 py-2 text-slate-700">
                          {item.distance}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-slate-800">
                          {item.price === 1
                            ? "미정"
                            : item.price === 0 || item.price === null
                              ? "무료"
                              : `${item.price.toLocaleString()}원`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDateTimeOptional(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"] as const;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = dayNames[date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (hours === "00" && minutes === "00") {
    return `${year}년 ${month}월 ${day}일(${dayName})`;
  }

  return `${year}년 ${month}월 ${day}일(${dayName}) ${hours}:${minutes}`;
}
