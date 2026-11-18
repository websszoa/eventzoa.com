"use client";

import { useState, useTransition } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { updateInquiryStatus } from "@/app/admin/inquiries/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  inquiryStatusLabels,
  inquiryStatuses,
  type InquiryStatus,
} from "@/lib/contact";

export default function PageAdminInquiryStatus({
  inquiryId,
  initialStatus,
}: {
  inquiryId: number;
  initialStatus: InquiryStatus;
}) {
  const [status, setStatus] = useState<InquiryStatus>(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, status);
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as InquiryStatus)}
          disabled={isPending}
        >
          <SelectTrigger className="h-11! w-full rounded-xl bg-white sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {inquiryStatuses.map((item) => (
              <SelectItem key={item} value={item}>
                {inquiryStatusLabels[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          onClick={handleUpdate}
          disabled={isPending || status === initialStatus}
          className="h-11 rounded-xl"
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="size-4" aria-hidden="true" />
          )}
          {isPending ? "변경 중..." : "상태 변경"}
        </Button>
      </div>
      {message && (
        <p className="text-sm text-slate-500" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
