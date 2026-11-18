import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LogIn,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import PageTitle from "@/components/page/page-title";
import PageMemberAvatar from "@/components/page/page-member-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "마이페이지",
    description: "이벤트조아 회원 정보와 방문 기록을 확인하세요.",
    path: "/mypage",
  }),
  robots: { index: false, follow: false },
};

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, avatar_url, provider, providers, role, visit_count, last_visited_at, created_at",
    )
    .eq("id", user.id)
    .maybeSingle();
  const metadata = user.user_metadata;
  const name =
    profile?.display_name ||
    metadata.full_name ||
    metadata.name ||
    user.email?.split("@")[0] ||
    "회원";
  const avatarUrl =
    profile?.avatar_url || metadata.avatar_url || metadata.picture || undefined;
  const provider = profile?.provider || user.app_metadata.provider || "google";
  const visitCount = profile?.visit_count ?? 1;
  const role = profile?.role === "admin" ? "관리자" : "일반 사용자";
  const providerLabel =
    provider === "google"
      ? "Google"
      : provider === "kakao"
        ? "카카오"
        : provider;
  const formatAccountDate = (value: string | null | undefined) => {
    if (!value) return "기록 없음";

    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "long",
      timeZone: "Asia/Seoul",
    }).format(new Date(value));
  };

  return (
    <>
      <PageTitle
        eyebrow="나의 이벤트조아"
        title={`${name}님의`}
        highlight="마이페이지"
        description="회원 정보와 이벤트조아 방문 기록을 한눈에 확인하세요."
      />
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="container">
          <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white lg:sticky lg:top-28">
              <div className="border-b border-slate-200 bg-blue-50 px-6 py-7 text-center">
                <PageMemberAvatar
                  src={avatarUrl}
                  name={name}
                  alt={`${name} 프로필`}
                  className="mx-auto size-20 border-2 border-blue-100"
                  fallbackClassName="bg-blue-100 font-cafe24 text-2xl font-bold text-blue-700"
                />
                <h2 className="mt-4 font-cafe24 text-2xl font-bold text-slate-950">
                  {name}님
                </h2>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {user.email}
                </p>
                <Badge className="mt-3 rounded-full bg-blue-600 text-white hover:bg-blue-600">
                  {role}
                </Badge>
              </div>

              <nav aria-label="마이페이지 메뉴" className="space-y-1 p-3">
                <MyPageNavItem
                  href="#account"
                  icon={UserRound}
                  label="계정 정보"
                  active
                />
                <MyPageNavItem
                  href="#activity"
                  icon={CalendarCheck}
                  label="활동 요약"
                />
              </nav>
            </aside>

            <div className="min-w-0 space-y-6">
              <Card
                id="account"
                className="scroll-mt-28 gap-0 rounded-3xl border-slate-200 bg-white py-0"
              >
                <CardHeader className="border-b border-slate-200 px-6 py-6 sm:px-8">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-blue-600">
                      PROFILE
                    </p>
                    <CardTitle className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">
                      계정 정보
                    </CardTitle>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      로그인 계정과 회원 상태를 확인할 수 있습니다.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                    <AccountRow icon={UserRound} label="이름" value={name} />
                    <AccountRow
                      icon={Mail}
                      label="이메일"
                      value={user.email || "이메일 정보 없음"}
                    />
                    <AccountRow
                      icon={LogIn}
                      label="가입 계정"
                      value={providerLabel}
                    />
                    <AccountRow
                      icon={ShieldCheck}
                      label="회원 등급"
                      value={role}
                    />
                    <AccountRow
                      icon={CheckCircle2}
                      label="계정 상태"
                      value="정상 이용 중"
                      valueClassName="text-emerald-700"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card
                id="activity"
                className="scroll-mt-28 gap-0 rounded-3xl border-slate-200 bg-white py-0"
              >
                <CardHeader className="border-b border-slate-200 px-6 py-6 sm:px-8">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-blue-600">
                      ACTIVITY
                    </p>
                    <CardTitle className="mt-2 font-cafe24 text-3xl font-bold text-slate-950">
                      활동 요약
                    </CardTitle>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      이벤트조아와 함께한 기록입니다.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
                  <ActivityItem
                    icon={CalendarCheck}
                    label="방문 횟수"
                    value={`${visitCount.toLocaleString("ko-KR")}회`}
                  />
                  <ActivityItem
                    icon={Clock3}
                    label="최근 방문"
                    value={formatAccountDate(profile?.last_visited_at)}
                  />
                  <ActivityItem
                    icon={CalendarDays}
                    label="가입일"
                    value={formatAccountDate(profile?.created_at)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function MyPageNavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: typeof UserRound;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors ${active ? "bg-blue-50 font-bold text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"}`}
    >
      <span className="flex items-center gap-3">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </span>
      <ChevronRight className="size-4" aria-hidden="true" />
    </a>
  );
}

function AccountRow({
  icon: Icon,
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:px-6">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span>{label}</span>
      </div>
      <p className={`min-w-0 break-all text-sm font-bold sm:text-base ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-700">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 break-keep font-bold text-slate-950">{value}</p>
    </div>
  );
}
