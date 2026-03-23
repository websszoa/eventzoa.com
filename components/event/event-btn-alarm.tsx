"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/context-auth";
import { useLogin } from "@/contexts/context-login";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type EventBtnAlarmProps = {
  eventId: string;
};

export default function EventBtnAlarm({ eventId: _ }: EventBtnAlarmProps) {
  const { user } = useAuth();
  const { openLogin } = useLogin();

  const handleAlarm = () => {
    if (!user) {
      openLogin();
      return;
    }
    toast.info("알림 설정 기능은 준비 중입니다.");
  };

  return (
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
  );
}
