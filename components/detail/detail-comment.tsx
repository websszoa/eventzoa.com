"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/context-auth";
import { Button } from "@/components/ui/button";
import { MessageSquareMore, Trash2, PenLine, Baby } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import DialogComment from "@/components/dialog/dialog-comment";

interface Comment {
  id: string;
  user_id: string | null;
  name: string;
  content: string;
  created_at: string;
}

function formatCommentDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function getFaceImage(userId: string | null, index: number) {
  if (!userId) return `/face/face${String((index % 10) + 1).padStart(2, "0")}.png`;
  let hash = 0;
  for (let i = 0; i < userId.length; i++)
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return `/face/face${String((hash % 10) + 1).padStart(2, "0")}.png`;
}

export default function DetailComment({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  const fetchComments = async () => {
    const { data } = await supabase
      .from("event_comments")
      .select("id, user_id, name, content, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    setComments(data ?? []);
  };

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("event_comments").delete().eq("id", id);
    if (error) {
      toast.error("댓글 삭제에 실패했습니다.");
    } else {
      await fetchComments();
      toast.success("댓글이 삭제되었습니다.");
    }
  };

  return (
    <div className="h-[380px] detail__comment flex flex-col border border-gray-200 rounded-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="h-[60px] flex items-center gap-2 px-5 py-5 border-b border-gray-100 shrink-0">
        <MessageSquareMore className="w-5 h-5 text-brand shrink-0" />
        <h3 className="font-paperlogy font-semibold text-lg">댓글</h3>
        <span className="text-sm text-muted-foreground font-anyvid">({comments.length})</span>
        <div className="ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
                <PenLine className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-anyvid">메세지 작성하기</p>
            </TooltipContent>
          </Tooltip>
          <DialogComment
            eventId={eventId}
            open={open}
            onOpenChange={setOpen}
            onSuccess={fetchComments}
          />
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, i) => (
              <div key={comment.id} className="flex gap-3 border-b border-dashed pb-4 last:border-b-0">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-blue-50 border border-brand/20">
                  <Image
                    src={getFaceImage(comment.user_id, i)}
                    alt=""
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-sm font-anyvid truncate">{comment.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">{formatCommentDate(comment.created_at)}</span>
                    </div>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                        aria-label="댓글 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-anyvid break-keep mt-0.5">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500 text-sm font-nanumNeo border border-dashed rounded">
              <Baby className="w-14 h-14 text-brand/20 mx-auto mb-2" />
              아직 댓글이 없습니다. <br />첫 번째 리뷰를 남겨주세요! 💬
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
