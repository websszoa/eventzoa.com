"use client";

import { useState, useTransition } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { updateNewsletterStatus } from "@/app/admin/newsletters/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  newsletterStatusLabels,
  newsletterStatuses,
  type NewsletterStatus,
} from "@/lib/newsletter";

export default function PageAdminNewsletterStatus({
  newsletterId,
  initialStatus,
}: {
  newsletterId: string;
  initialStatus: NewsletterStatus;
}) {
  const [status, setStatus] = useState<NewsletterStatus>(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateNewsletterStatus(newsletterId, status);
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as NewsletterStatus)}
          disabled={isPending}
        >
          <SelectTrigger className="h-11! w-full rounded-xl bg-white sm:w-44">
            <SelectValue>
              {(value: NewsletterStatus) => newsletterStatusLabels[value]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {newsletterStatuses.map((item) => (
              <SelectItem key={item} value={item}>
                {newsletterStatusLabels[item]}
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
