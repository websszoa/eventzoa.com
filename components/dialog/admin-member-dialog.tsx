"use client";

import { CalendarDays, ChevronRight, Clock3, LogIn, Mail, ShieldCheck } from "lucide-react";

import PageAdminMemberSettings from "@/components/page/page-admin-member-settings";
import PageMemberAvatar from "@/components/page/page-member-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export type AdminMemberDialogData = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  provider: string;
  providers: string[];
  role: "user" | "admin";
  status: "active" | "suspended" | "withdrawn";
  visit_count: number;
  last_visited_at: string | null;
  withdrawn_at: string | null;
  created_at: string;
};

const statusLabels: Record<AdminMemberDialogData["status"], string> = {
  active: "정상",
  suspended: "이용 정지",
  withdrawn: "탈퇴",
};

function formatDate(value: string | null, includeTime = false) {
  if (!value) return "기록 없음";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    ...(includeTime ? { timeStyle: "short" as const } : {}),
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export default function AdminMemberDialog({ member, currentAdminId }: { member: AdminMemberDialogData; currentAdminId: string }) {
  const name = member.display_name || member.email || "회원";

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" variant="ghost" className="group grid h-auto w-full grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-none border-0 px-5 py-5 text-left font-normal transition-colors hover:bg-blue-50/50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-7" />}>
        <PageMemberAvatar src={member.avatar_url} name={name} alt={`${name} 프로필`} className="size-12 border border-blue-100" fallbackClassName="bg-blue-100 font-bold text-blue-700" />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate font-cafe24 text-xl font-bold text-slate-950 group-hover:text-blue-700">{name}</span>
            {member.role === "admin" && <Badge className="rounded-full bg-blue-50 text-blue-700">관리자</Badge>}
            <Badge variant="outline" className="rounded-full">{statusLabels[member.status]}</Badge>
          </span>
          <span className="mt-1 block truncate text-xs text-slate-500">{member.email || "이메일 없음"} · {member.provider} · 방문 {member.visit_count.toLocaleString("ko-KR")}회</span>
          <span className="mt-1 block text-xs text-slate-400">최근 방문 {formatDate(member.last_visited_at)}</span>
        </span>
        <ChevronRight className="hidden size-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500 sm:block" aria-hidden="true" />
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border-0 bg-white p-0 ring-1 ring-slate-200 sm:max-w-3xl">
        <div className="bg-blue-50 px-6 py-7 sm:px-8">
          <div className="flex items-center gap-4 pr-10">
            <PageMemberAvatar src={member.avatar_url} name={name} alt={`${name} 프로필`} className="size-16 border-2 border-blue-100" fallbackClassName="bg-blue-100 font-cafe24 text-xl font-bold text-blue-700" />
            <DialogHeader className="min-w-0 gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-blue-600 text-white">{member.role === "admin" ? "관리자" : "일반 사용자"}</Badge>
                <Badge variant="outline" className="rounded-full bg-white">{statusLabels[member.status]}</Badge>
              </div>
              <DialogTitle className="truncate font-cafe24 text-3xl font-bold text-slate-950">{name}</DialogTitle>
              <DialogDescription className="truncate text-slate-500">{member.email || "이메일 없음"}</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="grid gap-6 px-6 pt-2 pb-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            <InfoRow icon={Mail} label="이메일" value={member.email || "이메일 없음"} />
            <InfoRow icon={LogIn} label="로그인 제공자" value={(member.providers.length > 0 ? member.providers : [member.provider]).join(", ")} />
            <InfoRow icon={ShieldCheck} label="회원 ID" value={member.id} />
            <InfoRow icon={Clock3} label="방문 횟수" value={`${member.visit_count.toLocaleString("ko-KR")}회`} />
            <InfoRow icon={CalendarDays} label="최근 방문" value={formatDate(member.last_visited_at, true)} />
            <InfoRow icon={CalendarDays} label="가입일" value={formatDate(member.created_at, true)} />
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-blue-600">회원 설정</p>
            <p className="mt-1 mb-4 text-xs leading-5 text-slate-500">권한과 이용 상태를 변경합니다.</p>
            <PageAdminMemberSettings memberId={member.id} initialRole={member.role} initialStatus={member.status} isCurrentAdmin={member.id === currentAdminId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="size-3.5 text-blue-700" aria-hidden="true" />{label}</div>
      <p className="mt-1.5 break-all text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
