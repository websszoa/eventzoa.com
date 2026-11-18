"use client";

import { CircleCheckBig } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ContactSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContactSuccessDialog({
  open,
  onOpenChange,
}: ContactSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border-0 bg-white p-0 ring-1 ring-slate-200 sm:max-w-105">
        <div className="bg-blue-50 px-7 pt-9 pb-7 text-center sm:px-9">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-600 text-white">
            <CircleCheckBig className="size-7" aria-hidden="true" />
          </div>
          <DialogHeader className="mt-5 items-center gap-2">
            <DialogTitle className="font-cafe24 text-3xl font-bold text-slate-950">
              문의가 접수되었어요!
            </DialogTitle>
            <DialogDescription className="max-w-75 leading-6 text-slate-600 break-keep">
              보내주신 내용을 확인한 뒤 입력하신 이메일로 답변드리겠습니다.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-7 pt-4 pb-8 sm:px-9">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-12 w-full rounded-xl font-bold"
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
