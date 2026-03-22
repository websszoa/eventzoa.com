import { ClipboardList, CircleDollarSign } from "lucide-react";
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
  const { registration_status, registration_start_at, registration_end_at,
    registration_add_start_at, registration_add_end_at, registration_price } = event;

  const regPeriod = formatDateRange(registration_start_at, registration_end_at);
  const addPeriod = formatDateRange(registration_add_start_at, registration_add_end_at);
  const hasPrices = registration_price && registration_price.length > 0;

  return (
    <div className="detail__registration h-full border border-gray-200 rounded-2xl p-5">
      <h3 className="flex items-center gap-2 font-paperlogy font-semibold text-lg mb-4">
        <ClipboardList className="w-5 h-5 text-brand shrink-0" />
        접수 정보
      </h3>

      <div className="space-y-4 font-anyvid text-sm">
        {/* 접수 상태 */}
        {registration_status && (
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-muted-foreground">접수 상태</span>
            <Badge variant={REGISTRATION_STATUS_VARIANT[registration_status] ?? "outline"}>
              {registration_status}
            </Badge>
          </div>
        )}

        {/* 접수 기간 */}
        {regPeriod !== "-" && (
          <div className="flex items-start gap-3">
            <span className="w-20 shrink-0 text-muted-foreground">접수 기간</span>
            <span className="flex-1 text-slate-800 break-keep">{regPeriod}</span>
          </div>
        )}

        {/* 추가 접수 기간 */}
        {addPeriod !== "-" && (
          <div className="flex items-start gap-3">
            <span className="w-20 shrink-0 text-muted-foreground">추가 접수</span>
            <span className="flex-1 text-slate-800 break-keep">{addPeriod}</span>
          </div>
        )}

        {/* 참가비 */}
        {hasPrices && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <CircleDollarSign className="h-4 w-4 text-green-500 shrink-0" />
              <span>참가비</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">구분</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {registration_price.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2 text-slate-700">{item.distance}</td>
                      <td className="px-3 py-2 text-right text-slate-800 font-medium">
                        {item.price ? `${item.price.toLocaleString()}원` : "무료"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!registration_status && regPeriod === "-" && !hasPrices && (
          <p className="text-muted-foreground text-xs">접수 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
