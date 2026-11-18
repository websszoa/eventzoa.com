"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Link2,
  Mail,
  UserRound,
} from "lucide-react";

import AdminInquiryDeleteDialog from "@/components/dialog/admin-inquiry-delete-dialog";
import PageAdminInquiryReply from "@/components/page/page-admin-inquiry-reply";
import PageAdminInquiryStatus from "@/components/page/page-admin-inquiry-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  inquiryStatusLabels,
  inquiryTypeLabels,
  type InquiryStatus,
  type InquiryType,
} from "@/lib/contact";

export type AdminInquiryDialogData = {
  id: number;
  type: InquiryType;
  name: string;
  email: string;
  subject: string;
  related_url: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

function getStatusClassName(status: InquiryStatus) {
  if (status === "pending") return "bg-amber-50 text-amber-700";
  if (status === "in_progress") return "bg-blue-50 text-blue-700";
  if (status === "resolved") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-600";
}

function getSafeUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export default function AdminInquiryDialog({
  inquiry,
}: {
  inquiry: AdminInquiryDialogData;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const relatedUrl = getSafeUrl(inquiry.related_url);

  function handleDeleted() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="group grid h-auto w-full gap-3 rounded-none border-0 px-5 py-5 text-left font-normal transition-colors hover:bg-blue-50/50 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center sm:px-7"
          />
        }
      >
        <span className="flex items-center gap-2 sm:block">
          <Badge
            className={`rounded-full ${getStatusClassName(inquiry.status)}`}
          >
            {inquiryStatusLabels[inquiry.status]}
          </Badge>
          <span className="mt-0 block text-xs text-slate-400 sm:mt-2">
            #{inquiry.id}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-bold text-blue-600">
            {inquiryTypeLabels[inquiry.type]}
          </span>
          <span className="mt-1 block truncate font-cafe24 text-xl font-bold text-slate-950 group-hover:text-blue-700">
            {inquiry.subject}
          </span>
          <span className="mt-2 block truncate text-xs text-slate-500">
            {inquiry.name} · {inquiry.email} · {formatDate(inquiry.created_at)}
          </span>
        </span>
        <ChevronRight
          className="hidden size-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500 sm:block"
          aria-hidden="true"
        />
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border-0 bg-white p-0 ring-1 ring-slate-200 sm:max-w-3xl">
        <div className="bg-blue-50 px-6 py-7 sm:px-8">
          <DialogHeader className="gap-3 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-blue-600 text-white">
                {inquiryTypeLabels[inquiry.type]}
              </Badge>
              <Badge variant="outline" className="rounded-full bg-white">
                {inquiryStatusLabels[inquiry.status]}
              </Badge>
              <span className="text-xs text-slate-400">#{inquiry.id}</span>
            </div>
            <DialogTitle className="font-cafe24 text-3xl leading-tight font-bold text-slate-950">
              {inquiry.subject}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {inquiry.name}님의 문의입니다.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 pt-2 pb-7 sm:px-8">
          <div className="min-w-0 space-y-5">
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
              <InfoItem icon={UserRound} label="문의자" value={inquiry.name} />
              <InfoItem icon={Mail} label="이메일" value={inquiry.email} />
              <InfoItem
                icon={CalendarDays}
                label="접수일"
                value={formatDate(inquiry.created_at)}
              />
              <InfoItem
                icon={CalendarDays}
                label="최근 변경"
                value={formatDate(inquiry.updated_at)}
              />
            </div>
            {relatedUrl && (
              <a
                href={relatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 break-all text-sm font-bold text-blue-700 hover:underline"
              >
                <Link2 className="size-4 shrink-0" aria-hidden="true" />
                {relatedUrl}
              </a>
            )}
            <div>
              <p className="text-xs font-bold text-slate-500">문의 내용</p>
              <div className="mt-2 whitespace-pre-wrap break-words rounded-2xl border border-slate-200 p-5 text-sm leading-7 text-slate-700">
                {inquiry.message}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6">
            <PageAdminInquiryReply
              inquiryId={inquiry.id}
              recipientEmail={inquiry.email}
            />
          </div>
          <div className="border-t border-slate-200 pt-6">
            <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
              <p className="text-sm font-bold text-blue-600">처리 상태</p>
              <p className="mt-1 mb-4 text-xs leading-5 text-slate-500">
                문의 내용 확인 후 처리 단계를 변경해 주세요.
              </p>
              <PageAdminInquiryStatus
                inquiryId={inquiry.id}
                initialStatus={inquiry.status}
              />
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-200 pt-6">
            <AdminInquiryDeleteDialog
              inquiryId={inquiry.id}
              subject={inquiry.subject}
              onDeleted={handleDeleted}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-blue-700"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-all text-sm text-slate-900">{value}</p>
      </div>
    </div>
  );
}
