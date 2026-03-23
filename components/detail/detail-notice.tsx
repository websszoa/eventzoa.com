import { AlertTriangle, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";
import { PRECAUTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DetailNoticeProps = {
  event: Event;
};

export default function DetailNotice({ event }: DetailNoticeProps) {
  const hasSite = Boolean(event.event_site?.trim());

  return (
    <div className="detail__notice detail__box">
      <div className="detail__header">
        <AlertTriangle className="text-amber-500" />
        <h3>주의사항</h3>
        {hasSite && (
          <div className="ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <a
                    href={event.event_site!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="공식사이트 보기"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-anyvid">공식사이트 보기</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="space-y-3 text-sm text-slate-700 m-6 font-anyvid">
        <ul className="list-disc space-y-1.5 pl-3 text-muted-foreground">
          {PRECAUTIONS.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
