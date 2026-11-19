"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteNewsletter } from "@/app/admin/newsletters/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminNewsletterDeleteDialog({
  newsletterId,
  email,
  onDeleted,
}: {
  newsletterId: string;
  email: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setMessage(null);
    startTransition(async () => {
      const result = await deleteNewsletter(newsletterId);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setOpen(false);
      onDeleted();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return;
        setOpen(nextOpen);
        if (!nextOpen) setMessage(null);
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-xl px-4"
          />
        }
      >
        <Trash2 className="size-4" aria-hidden="true" />
        구독자 삭제
      </DialogTrigger>

      <DialogContent
        className="rounded-3xl border-0 bg-white p-0 ring-1 ring-slate-200 sm:max-w-md"
        showCloseButton={!isPending}
      >
        <div className="px-6 pt-7 sm:px-7">
          <DialogHeader className="gap-3 pr-8">
            <span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="size-5" aria-hidden="true" />
            </span>
            <DialogTitle className="font-cafe24 text-2xl font-bold text-slate-950">
              구독자를 삭제할까요?
            </DialogTitle>
            <DialogDescription className="leading-6 text-slate-500">
              &lsquo;{email}&rsquo; 구독 정보가 영구적으로 삭제됩니다. 발송만
              멈추려면 삭제 대신 구독취소로 변경해 주세요.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 sm:px-7 sm:pb-7">
          {message && (
            <p
              className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {message}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-11 rounded-xl bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Trash2 className="size-4" aria-hidden="true" />
              )}
              {isPending ? "삭제 중..." : "삭제하기"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
