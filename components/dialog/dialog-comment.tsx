"use client";

import { useState } from "react";
import Image from "next/image";
import { TentTree, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/context-auth";
import { useLogin } from "@/contexts/context-login";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import { toast } from "sonner";

function getFaceImage(userId: string | null) {
  if (!userId) return `/face/face01.png`;
  let hash = 0;
  for (let i = 0; i < userId.length; i++)
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return `/face/face${String((hash % 10) + 1).padStart(2, "0")}.png`;
}

interface DialogCommentProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DialogComment({
  eventId,
  open,
  onOpenChange,
  onSuccess,
}: DialogCommentProps) {
  const { user } = useAuth();
  const { openLogin } = useLogin();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("event_comments").insert({
      event_id: eventId,
      user_id: user.id,
      name: user.user_metadata?.full_name ?? user.email ?? "익명",
      content: content.trim(),
    });

    if (error) {
      toast.error("댓글 작성에 실패했습니다.");
    } else {
      setContent("");
      onOpenChange(false);
      onSuccess?.();
      toast.success("댓글이 등록되었습니다.");
    }
    setIsSubmitting(false);
  };

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
              댓글 작성
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-center font-anyvid break-keep">
            {APP_NAME}의 이벤트에 대한 리뷰를 남겨주세요.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-anyvid border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
              <Image
                src={getFaceImage(user.id)}
                alt=""
                width={28}
                height={28}
                className="rounded-full shrink-0"
              />
              <span className="truncate">
                {user.user_metadata?.full_name ?? user.email}
              </span>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글을 입력하세요 (최대 200자)"
              maxLength={200}
              rows={5}
              className="resize-none font-anyvid text-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-anyvid">
                {content.length}/200
              </span>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={!content.trim() || isSubmitting}
                className="gap-1.5 font-anyvid"
              >
                등록
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <Button
              variant="destructive"
              size="sm"
              className="w-full h-11 font-anyvid"
              onClick={() => {
                onOpenChange(false);
                openLogin();
              }}
            >
              로그인하기
            </Button>
            <p className="text-sm text-center text-muted-foreground font-anyvid pb-2">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
