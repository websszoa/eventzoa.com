"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CalendarX,
  ChevronRight,
  Compass,
  Mail,
  MousePointerClick,
  UserRound,
} from "lucide-react";

import AdminNewsletterDeleteDialog from "@/components/dialog/admin-newsletter-delete-dialog";
import PageAdminNewsletterStatus from "@/components/page/page-admin-newsletter-status";
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
  newsletterStatusLabels,
  type NewsletterStatus,
} from "@/lib/newsletter";

export type AdminNewsletterDialogData = {
  id: string;
  email: string;
  age: string | null;
  acquisition_source: string | null;
  content_preference: string | null;
  subscription_source: string;
  agree_ads: boolean;
  status: NewsletterStatus;
  unsubscribed_at: string | null;
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

function getStatusClassName(status: NewsletterStatus) {
  return status === "subscribed"
    ? "bg-blue-50 text-blue-700"
    : "bg-slate-100 text-slate-600";
}

export default function AdminNewsletterDialog({
  newsletter,
}: {
  newsletter: AdminNewsletterDialogData;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
            className={`rounded-full ${getStatusClassName(newsletter.status)}`}
          >
            {newsletterStatusLabels[newsletter.status]}
          </Badge>
          <span className="mt-0 block text-xs text-slate-400 sm:mt-2">
            {newsletter.subscription_source}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block truncate font-cafe24 text-xl font-bold text-slate-950 group-hover:text-blue-700">
            {newsletter.email}
          </span>
          <span className="mt-2 block truncate text-xs text-slate-500">
            {[newsletter.age, newsletter.acquisition_source]
              .filter(Boolean)
              .join(" · ")}
            {" · "}
            {formatDate(newsletter.created_at)}
          </span>
        </span>
        <ChevronRight
          className="hidden size-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500 sm:block"
          aria-hidden="true"
        />
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border-0 bg-white p-0 ring-1 ring-slate-200 sm:max-w-2xl">
        <div className="bg-blue-50 px-6 py-7 sm:px-8">
          <DialogHeader className="gap-3 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-blue-600 text-white">
                {newsletter.subscription_source}
              </Badge>
              <Badge variant="outline" className="rounded-full bg-white">
                {newsletterStatusLabels[newsletter.status]}
              </Badge>
            </div>
            <DialogTitle className="font-cafe24 text-3xl leading-tight font-bold break-all text-slate-950">
              {newsletter.email}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              뉴스레터 구독자 정보입니다.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 pt-2 pb-7 sm:px-8">
          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
            <InfoItem icon={Mail} label="이메일" value={newsletter.email} />
            <InfoItem icon={UserRound} label="나이대" value={newsletter.age} />
            <InfoItem
              icon={Compass}
              label="알게 된 경로"
              value={newsletter.acquisition_source}
            />
            <InfoItem
              icon={MousePointerClick}
              label="신청 위치"
              value={newsletter.subscription_source}
            />
            <InfoItem
              icon={CalendarDays}
              label="구독일"
              value={formatDate(newsletter.created_at)}
            />
            <InfoItem
              icon={CalendarX}
              label="구독 취소일"
              value={
                newsletter.unsubscribed_at
                  ? formatDate(newsletter.unsubscribed_at)
                  : null
              }
            />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500">
              가장 받고 싶은 정보
            </p>
            <div className="mt-2 rounded-2xl border border-slate-200 p-5 text-sm leading-7 break-words whitespace-pre-wrap text-slate-700">
              {newsletter.content_preference || "입력하지 않았어요."}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
              <p className="text-sm font-bold text-blue-600">구독 상태</p>
              <p className="mt-1 mb-4 text-xs leading-5 text-slate-500">
                구독 취소 요청을 받으면 구독취소로 변경해 주세요. 발송 대상에서
                빠집니다.
              </p>
              <PageAdminNewsletterStatus
                newsletterId={newsletter.id}
                initialStatus={newsletter.status}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-6">
            <AdminNewsletterDeleteDialog
              newsletterId={newsletter.id}
              email={newsletter.email}
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
  value: string | null;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-blue-700"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-sm break-all text-slate-900">{value || "-"}</p>
      </div>
    </div>
  );
}
