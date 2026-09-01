import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { notFound } from "next/navigation";

import PageAdminMemberSettings from "@/components/page/page-admin-member-settings";
import PageMemberAvatar from "@/components/page/page-member-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "회원 상세 | 이벤트조아",
  robots: { index: false, follow: false },
};

type MemberDetail = {
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
  updated_at: string;
};

const statusLabels: Record<MemberDetail["status"], string> = {
  active: "정상",
  suspended: "이용 정지",
  withdrawn: "탈퇴",
};

function formatDate(value: string | null) {
  if (!value) return "기록 없음";

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const adminUser = await requireAdmin();
  const { id } = await params;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, display_name, avatar_url, provider, providers, role, status, visit_count, last_visited_at, withdrawn_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load member: ${error.code}`);
  if (!data) notFound();

  const member = data as MemberDetail;
  const name = member.display_name || member.email || "회원";

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="container max-w-5xl">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          회원 목록
        </Link>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="gap-0 rounded-3xl border-slate-200 bg-white py-0">
            <CardHeader className="flex-row items-center gap-5 border-b border-slate-200 px-6 py-7 sm:px-8">
              <PageMemberAvatar
                src={member.avatar_url}
                name={name}
                alt={`${name} 프로필`}
                className="size-18 border-2 border-blue-100"
                fallbackClassName="bg-blue-100 font-cafe24 text-2xl font-bold text-blue-700"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-blue-50 text-blue-700">
                    {member.role === "admin" ? "관리자" : "일반 사용자"}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {statusLabels[member.status]}
                  </Badge>
                </div>
                <CardTitle className="mt-3 truncate font-cafe24 text-3xl font-bold text-slate-950">
                  {name}
                </CardTitle>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {member.email || "이메일 없음"}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                <InfoRow
                  icon={Mail}
                  label="이메일"
                  value={member.email || "이메일 없음"}
                />
                <InfoRow
                  icon={LogIn}
                  label="로그인 제공자"
                  value={(member.providers.length > 0
                    ? member.providers
                    : [member.provider]
                  ).join(", ")}
                />
                <InfoRow
                  icon={ShieldCheck}
                  label="회원 ID"
                  value={member.id}
                />
                <InfoRow
                  icon={Clock3}
                  label="방문 횟수"
                  value={`${member.visit_count.toLocaleString("ko-KR")}회`}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="최근 방문"
                  value={formatDate(member.last_visited_at)}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="가입일"
                  value={formatDate(member.created_at)}
                />
                {member.withdrawn_at && (
                  <InfoRow
                    icon={CalendarDays}
                    label="탈퇴 처리일"
                    value={formatDate(member.withdrawn_at)}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 lg:sticky lg:top-28">
            <p className="text-sm font-bold text-blue-600">회원 설정</p>
            <h2 className="mt-2 font-cafe24 text-2xl font-bold text-slate-950">
              권한 및 상태
            </h2>
            <p className="mt-2 mb-5 text-xs leading-5 text-slate-500">
              회원의 관리자 권한과 서비스 이용 상태를 변경합니다.
            </p>
            <PageAdminMemberSettings
              memberId={member.id}
              initialRole={member.role}
              initialStatus={member.status}
              isCurrentAdmin={member.id === adminUser.id}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:px-6">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span>{label}</span>
      </div>
      <p className="min-w-0 break-all text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
