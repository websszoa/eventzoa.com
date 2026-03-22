import { AlertTriangle, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";
import { PRECAUTIONS } from "@/lib/constants";

type DetailNoticeProps = {
  event: Event;
};

export default function DetailNotice({ event }: DetailNoticeProps) {
  const hasSite = Boolean(event.event_site?.trim());

  return (
    <div className="detail__notice md:border border-gray-200 rounded-lg mb-8 md:mb-4 p-0 md:p-5 font-anyvid">
      <h3 className="flex items-center gap-2 font-paperlogy font-semibold text-lg">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        마라톤 주의사항
      </h3>
      <div className="mt-2 space-y-3 text-sm text-slate-700">
        {hasSite && (
          <p className="flex flex-wrap items-center gap-1 rounded px-4 py-3 bg-gray-50">
            <span>자세한 일정·코스·규정은</span>
            <a
              href={event.event_site!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand font-medium hover:underline underline-offset-4"
            >
              공식 대회 사이트
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span>에서 확인해 주세요.</span>
          </p>
        )}
        {!hasSite && (
          <p className="rounded px-4 py-3 bg-gray-50">
            자세한 정보는 대회 주최 측{" "}
            <span className="text-brand font-medium">공식 채널</span>을 통해
            확인하시기 바랍니다.
          </p>
        )}
        <ul className="list-disc space-y-1.5 pl-3 text-muted-foreground">
          {PRECAUTIONS.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
