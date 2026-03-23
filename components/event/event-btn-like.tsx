"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/context-auth";
import { useLogin } from "@/contexts/context-login";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type EventBtnLikeProps = {
  eventId: string;
};

export default function EventBtnLike({ eventId }: EventBtnLikeProps) {
  const { user, isLoading } = useAuth();
  const { openLogin } = useLogin();
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let isMounted = true;

    const fetchLikeState = async () => {
      if (!user) {
        if (isMounted) setIsLiked(false);
        return;
      }

      const { data, error } = await supabase
        .from("event_likes")
        .select("event_id")
        .eq("event_id", eventId)
        .limit(1);

      if (!isMounted) return;
      if (error) return;

      setIsLiked((data?.length ?? 0) > 0);
    };

    if (!isLoading) {
      fetchLikeState();
    }

    return () => {
      isMounted = false;
    };
  }, [eventId, isLoading, supabase, user]);

  const handleLike = async () => {
    if (isSubmitting) return;

    if (!user) {
      openLogin();
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.rpc("toggle_like", {
      p_event_id: eventId,
    });

    if (error) {
      toast.error("좋아요 반영에 실패했습니다.");
      setIsSubmitting(false);
      return;
    }

    const nextLiked = Boolean(data);
    setIsLiked(nextLiked);
    toast.success(nextLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.");
    setIsSubmitting(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="좋아요"
          className={cn(
            "h-10 w-10 shrink-0 border-slate-200 text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600",
            isLiked && "border-red-200 bg-red-50 text-red-600",
          )}
          onClick={handleLike}
          disabled={isSubmitting}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">{isLiked ? "좋아요 취소" : "좋아요"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
