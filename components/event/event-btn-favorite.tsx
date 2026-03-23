"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
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

type EventBtnFavoriteProps = {
  eventId: string;
};

export default function EventBtnFavorite({
  eventId,
}: EventBtnFavoriteProps) {
  const { user, isLoading } = useAuth();
  const { openLogin } = useLogin();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let isMounted = true;

    const fetchFavoriteState = async () => {
      if (!user) {
        if (isMounted) setIsFavorite(false);
        return;
      }

      const { data, error } = await supabase
        .from("event_favorites")
        .select("event_id")
        .eq("event_id", eventId)
        .limit(1);

      if (!isMounted) return;
      if (error) return;

      setIsFavorite((data?.length ?? 0) > 0);
    };

    if (!isLoading) {
      fetchFavoriteState();
    }

    return () => {
      isMounted = false;
    };
  }, [eventId, isLoading, supabase, user]);

  const handleFavorite = async () => {
    if (isSubmitting) return;

    if (!user) {
      openLogin();
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.rpc("toggle_favorite", {
      p_event_id: eventId,
    });

    if (error) {
      toast.error("즐겨찾기 반영에 실패했습니다.");
      setIsSubmitting(false);
      return;
    }

    const nextFavorite = Boolean(data);
    setIsFavorite(nextFavorite);
    toast.success(
      nextFavorite ? "즐겨찾기에 추가했습니다." : "즐겨찾기를 해제했습니다.",
    );
    setIsSubmitting(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="즐겨찾기"
          className={cn(
            "h-10 w-10 shrink-0 border-slate-200 text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600",
            isFavorite && "border-red-200 bg-red-50 text-red-600",
          )}
          onClick={handleFavorite}
          disabled={isSubmitting}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-nanumNeo">
          {isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
