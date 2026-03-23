"use client";

import { useEffect, useState } from "react";
import { MessageSquareMore } from "lucide-react";
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
import DialogComment from "@/components/dialog/dialog-comment";

type EventBtnCommentProps = {
  eventId: string;
};

export default function EventBtnComment({ eventId }: EventBtnCommentProps) {
  const { user, isLoading } = useAuth();
  const { openLogin } = useLogin();
  const [hasCommented, setHasCommented] = useState(false);
  const [open, setOpen] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let isMounted = true;

    const fetchCommentState = async () => {
      if (!user) {
        if (isMounted) setHasCommented(false);
        return;
      }

      const { data, error } = await supabase
        .from("event_comments")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .limit(1);

      if (!isMounted) return;
      if (error) return;

      setHasCommented((data?.length ?? 0) > 0);
    };

    if (!isLoading) {
      fetchCommentState();
    }

    return () => {
      isMounted = false;
    };
  }, [eventId, isLoading, supabase, user]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 shrink-0 border-slate-200 text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600",
              hasCommented && "border-red-200 bg-red-50 text-red-600",
            )}
            aria-label="댓글"
            onClick={() => user ? setOpen(true) : openLogin()}
          >
            <MessageSquareMore className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-nanumNeo">{hasCommented ? "댓글 작성됨" : "댓글"}</p>
        </TooltipContent>
      </Tooltip>

      <DialogComment
        eventId={eventId}
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => setHasCommented(true)}
      />
    </>
  );
}
