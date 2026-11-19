import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  MailCheck,
  MailX,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";

import AdminNewsletterDialog, {
  type AdminNewsletterDialogData,
} from "@/components/dialog/admin-newsletter-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageAdminNav from "@/components/page/page-admin-nav";
import { requireAdmin } from "@/lib/admin";
import {
  newsletterStatusLabels,
  newsletterStatuses,
  type NewsletterStatus,
} from "@/lib/newsletter";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "구독 관리 | 이벤트조아",
  robots: { index: false, follow: false },
};

function getMonthStartKst() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  return new Date(`${today.slice(0, 7)}-01T00:00:00+09:00`);
}

function getFilterHref(status: NewsletterStatus | null, keyword: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (keyword) params.set("q", keyword);
  const query = params.toString();
  return query ? `/admin/newsletters?${query}` : "/admin/newsletters";
}

export default async function AdminNewslettersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const selectedStatus = newsletterStatuses.includes(
    params.status as NewsletterStatus,
  )
    ? (params.status as NewsletterStatus)
    : null;
  const keyword = (params.q ?? "").trim().toLowerCase();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select(
      "id, email, age, acquisition_source, content_preference, subscription_source, agree_ads, status, unsubscribed_at, created_at, updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) throw new Error(`Failed to load newsletters: ${error.code}`);

  const newsletters = (data || []) as AdminNewsletterDialogData[];
  const filteredNewsletters = newsletters.filter(
    (newsletter) =>
      (!selectedStatus || newsletter.status === selectedStatus) &&
      (!keyword || newsletter.email.includes(keyword)),
  );
  const subscribedCount = newsletters.filter(
    (newsletter) => newsletter.status === "subscribed",
  ).length;
  const monthStart = getMonthStartKst();
  const monthlyCount = newsletters.filter(
    (newsletter) => new Date(newsletter.created_at) >= monthStart,
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="container">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">
              Admin
            </p>
            <h1 className="mt-2 font-cafe24 text-4xl font-bold text-slate-950 sm:text-5xl">
              구독 관리
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              뉴스레터 구독자를 확인하고 구독 상태를 관리합니다.
            </p>
            <PageAdminNav activeHref="/admin/newsletters" />
          </div>
          <Button
            nativeButton={false}
            render={<a href="/admin/newsletters/export" download />}
            variant="outline"
            className="h-11 w-fit rounded-xl bg-white px-4"
          >
            <Download className="size-4" aria-hidden="true" />
            구독중 이메일 CSV
          </Button>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white lg:sticky lg:top-28">
            <div className="border-b border-slate-200 bg-blue-50 px-5 py-5">
              <p className="text-sm font-bold text-blue-700">구독 현황</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                뉴스레터 구독자 현황입니다.
              </p>
            </div>
            <div className="divide-y divide-slate-200 px-5">
              <SummaryItem
                icon={UsersRound}
                label="전체 신청"
                value={newsletters.length}
              />
              <SummaryItem
                icon={MailCheck}
                label="구독중"
                value={subscribedCount}
              />
              <SummaryItem
                icon={MailX}
                label="구독취소"
                value={newsletters.length - subscribedCount}
              />
              <SummaryItem
                icon={Sparkles}
                label="이번 달 신규"
                value={monthlyCount}
              />
            </div>
            <div className="border-t border-slate-200 p-3">
              <p className="px-3 pt-1 pb-2 text-xs font-bold text-slate-400">
                구독 상태
              </p>
              <nav className="space-y-1" aria-label="구독 상태 필터">
                <StatusFilter
                  href={getFilterHref(null, keyword)}
                  active={!selectedStatus}
                >
                  전체
                </StatusFilter>
                {newsletterStatuses.map((status) => (
                  <StatusFilter
                    key={status}
                    href={getFilterHref(status, keyword)}
                    active={selectedStatus === status}
                  >
                    {newsletterStatusLabels[status]}
                  </StatusFilter>
                ))}
              </nav>
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b-[0.5px] border-slate-200 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
              <div>
                <p className="text-sm font-bold text-blue-600">구독자 목록</p>
                <h2 className="mt-1 font-cafe24 text-2xl font-bold text-slate-950">
                  {selectedStatus
                    ? newsletterStatusLabels[selectedStatus]
                    : "전체"}{" "}
                  {filteredNewsletters.length.toLocaleString("ko-KR")}명
                </h2>
              </div>
              <form
                action="/admin/newsletters"
                className="flex w-full gap-2 sm:w-72"
              >
                {selectedStatus && (
                  <input type="hidden" name="status" value={selectedStatus} />
                )}
                <Input
                  type="search"
                  name="q"
                  defaultValue={keyword}
                  placeholder="이메일 검색"
                  aria-label="이메일 검색"
                  className="h-10 rounded-xl"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="size-10 shrink-0 rounded-xl"
                  aria-label="검색"
                >
                  <Search className="size-4" aria-hidden="true" />
                </Button>
              </form>
            </div>
            <div className="[&>*+*]:border-t-[0.5px] [&>*+*]:border-slate-200">
              {filteredNewsletters.length > 0 ? (
                filteredNewsletters.map((newsletter) => (
                  <AdminNewsletterDialog
                    key={newsletter.id}
                    newsletter={newsletter}
                  />
                ))
              ) : (
                <div className="px-6 py-20 text-center">
                  <MailCheck
                    className="mx-auto size-9 text-slate-300"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-sm text-slate-500">
                    {keyword
                      ? "검색 결과가 없습니다."
                      : "해당 상태의 구독자가 없습니다."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MailCheck;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="flex flex-1 items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{label}</p>
        <p className="font-cafe24 text-2xl font-bold text-slate-950">
          {value.toLocaleString("ko-KR")}
        </p>
      </div>
    </div>
  );
}

function StatusFilter({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-blue-50 font-bold text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"}`}
    >
      {children}
      <ChevronRight className="size-4" aria-hidden="true" />
    </Link>
  );
}
