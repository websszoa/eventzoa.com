"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Send } from "lucide-react";

import { replyToInquiry } from "@/app/admin/inquiries/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_REPLY_LENGTH = 3000;

export default function PageAdminInquiryReply({
  inquiryId,
  recipientEmail,
}: {
  inquiryId: number;
  recipientEmail: string;
}) {
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    setMessage(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await replyToInquiry(inquiryId, reply);
      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) setReply("");
    });
  }

  return (
    <div className="rounded-2xl bg-blue-50 p-5 sm:p-6">
      <p className="text-sm font-bold text-blue-700">이메일 답변</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        작성한 답변은 {recipientEmail}로 전송됩니다.
      </p>
      <Textarea
        value={reply}
        onChange={(event) => {
          setReply(event.target.value);
          setMessage(null);
          setSuccess(false);
        }}
        maxLength={MAX_REPLY_LENGTH}
        disabled={isPending}
        placeholder="사용자에게 보낼 답변을 작성해 주세요."
        className="mt-4 min-h-36 resize-y rounded-xl border-slate-200 bg-white px-4 py-3 leading-6"
      />
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="text-xs text-slate-400">
          {reply.length.toLocaleString("ko-KR")} / {MAX_REPLY_LENGTH.toLocaleString("ko-KR")}
        </span>
        <Button
          type="button"
          onClick={handleSend}
          disabled={isPending || reply.trim().length < 2}
          className="h-11 rounded-xl px-5"
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {isPending ? "전송 중..." : "답변 보내기"}
        </Button>
      </div>
      {message && (
        <p
          className={`mt-3 rounded-xl px-4 py-3 text-sm ${success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
          role={success ? "status" : "alert"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
