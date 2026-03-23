"use client";

import Image from "next/image";
import { TentTree, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_ENG_NAME } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils";
import type { Event } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogAlarmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string;
  event?: Pick<
    Event,
    "name" | "event_start_at" | "event_end_at" | "location" | "region"
  >;
}

export default function DialogAlarm({
  open,
  onOpenChange,
  eventId,
  event,
}: DialogAlarmProps) {
  const period = event
    ? formatDateRange(event.event_start_at, event.event_end_at)
    : null;
  const place = event
    ? [event.region, event.location?.place].filter(Boolean).join(" · ")
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-paperlogy uppercase font-extrabold text-brand text-xl">
              <TentTree className="size-9" />
              {APP_ENG_NAME}
            </div>
            <DialogTitle className="font-paperlogy text-xl mt-2">
              알림 설정
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-center font-anyvid break-keep">
            알림을 설정하면, 이벤트 소식을 받아볼 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {event && (
            <div className="w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 space-y-2 font-anyvid text-sm">
              <p className="font-semibold text-slate-800 text-center break-keep">
                {event.name}
              </p>
              {period && period !== "-" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="break-keep">{period}</span>
                </div>
              )}
              {place && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="truncate">{place}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="destructive"
            className="w-full font-anyvid gap-2"
            disabled={!eventId}
            onClick={() => {
              if (eventId) {
                window.location.href = `/api/auth/google-calendar?eventId=${eventId}`;
              }
            }}
          >
            <Image
              src="/map/google-calendar.webp"
              alt=""
              width={18}
              height={18}
              className="rounded"
              aria-hidden="true"
            />
            구글 캘린더에 추가하기
          </Button>
          <Button
            variant="outline"
            className="w-full font-anyvid gap-2 border-[#03C75A] text-[#03C75A] bg-[#03C75A] text-white"
            disabled={!eventId}
            onClick={() => {
              if (eventId) {
                window.location.href = `/api/auth/naver-calendar?eventId=${eventId}`;
              }
            }}
          >
            <Image
              src="/map/naver-calendar.webp"
              alt=""
              width={18}
              height={18}
              className="rounded"
              aria-hidden="true"
            />
            네이버 캘린더에 추가하기
          </Button>
          <Button
            variant="outline"
            className="w-full font-anyvid"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
