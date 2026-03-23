"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/context-auth";
import { useLogin } from "@/contexts/context-login";
import { APP_NAME, APP_SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type EventBtnShareProps = {
  eventId: string;
  slug: string;
  name: string;
  description?: string | null;
};

export default function EventBtnShare({
  eventId,
  slug,
  name,
  description,
}: EventBtnShareProps) {
  const { user, isLoading } = useAuth();
  const { openLogin } = useLogin();
  const [isShared, setIsShared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabase] = useState(() => createClient());
  const eventUrl = `${APP_SITE_URL}/event/${slug}`;
  const shareText = description?.trim() || `${name} 이벤트를 확인해 보세요.`;

  useEffect(() => {
    let isMounted = true;

    const fetchSharedState = async () => {
      if (!user) {
        if (isMounted) setIsShared(false);
        return;
      }

      const { data, error } = await supabase
        .from("event_shares")
        .select("event_id")
        .eq("event_id", eventId)
        .limit(1);

      if (!isMounted) return;
      if (error) return;

      setIsShared((data?.length ?? 0) > 0);
    };

    if (!isLoading) {
      fetchSharedState();
    }

    return () => {
      isMounted = false;
    };
  }, [eventId, isLoading, supabase, user]);

  const persistShare = async () => {
    if (!user || isShared) return;

    const { error } = await supabase.rpc("add_share", {
      p_event_id: eventId,
    });

    if (error) {
      toast.error("공유 기록 반영에 실패했습니다.");
      return;
    }

    setIsShared(true);
  };

  const handleShare = async () => {
    if (isSubmitting) return;

    if (!user) {
      openLogin();
      return;
    }

    setIsSubmitting(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name} | ${APP_NAME}`,
          text: shareText,
          url: eventUrl,
        });
      } else {
        await navigator.clipboard.writeText(eventUrl);
        toast.success("이벤트 링크를 복사했습니다.");
      }

      await persistShare();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(eventUrl);
        toast.success("이벤트 링크를 복사했습니다.");
        await persistShare();
      } catch {
        toast.error("공유에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="공유하기"
          className={cn(
            "h-10 w-10 shrink-0 border-slate-200 text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600",
            isShared && "border-red-200 bg-red-50 text-red-600",
          )}
          onClick={handleShare}
          disabled={isSubmitting}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">{isShared ? "공유 반영됨" : "공유하기"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
