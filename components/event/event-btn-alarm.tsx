"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/context-auth";
import { useLogin } from "@/contexts/context-login";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import DialogAlarm from "@/components/dialog/dialog-alarm";
import type { Event } from "@/lib/types";

type EventBtnAlarmProps = {
  eventId: string;
  event?: Pick<Event, "name" | "event_start_at" | "event_end_at" | "location" | "region">;
};

export default function EventBtnAlarm({ eventId, event }: EventBtnAlarmProps) {
  const { user } = useAuth();
  const { openLogin } = useLogin();
  const [open, setOpen] = useState(false);

  const handleAlarm = () => {
    if (!user) {
      openLogin();
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 border-slate-200 text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="알림 설정"
            onClick={handleAlarm}
          >
            <Bell className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-nanumNeo">알림 설정</p>
        </TooltipContent>
      </Tooltip>

      <DialogAlarm open={open} onOpenChange={setOpen} eventId={eventId} event={event} />
    </>
  );
}
