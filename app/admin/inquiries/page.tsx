import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CircleHelp, Inbox, ListChecks } from "lucide-react";

import AdminInquiryDialog, { type AdminInquiryDialogData } from "@/components/dialog/admin-inquiry-dialog";
import { requireAdmin } from "@/lib/admin";
import {
  inquiryTypeLabels,
  inquiryTypes,
  type InquiryType,
} from "@/lib/contact";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "문의 관리 | 이벤트조아",
  robots: { index: false, follow: false },
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireAdmin();

  const requestedType = (await searchParams).type;
  const selectedType = inquiryTypes.includes(
    requestedType as InquiryType,
  )
    ? (requestedType as InquiryType)
    : null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, type, name, email, subject, related_url, message, status, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(`Failed to load inquiries: ${error.code}`);

  const inquiries = (data || []) as AdminInquiryDialogData[];
  const filteredInquiries = selectedType
    ? inquiries.filter((inquiry) => inquiry.type === selectedType)
    : inquiries;
  const pendingCount = inquiries.filter(
    (inquiry) => inquiry.status === "pending",
  ).length;
  const progressCount = inquiries.filter(
    (inquiry) => inquiry.status === "in_progress",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="container">
        <div className="border-b border-slate-200 pb-8">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">
              Admin
            </p>
            <h1 className="mt-2 font-cafe24 text-4xl font-bold text-slate-950 sm:text-5xl">
              문의 관리
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              접수된 문의를 확인하고 처리 상태를 관리합니다.
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white lg:sticky lg:top-28">
            <div className="border-b border-slate-200 bg-blue-50 px-5 py-5">
              <p className="text-sm font-bold text-blue-700">문의 현황</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                접수 및 처리 현황입니다.
              </p>
            </div>
            <div className="divide-y divide-slate-200 px-5">
              <SummaryItem icon={Inbox} label="전체 문의" value={inquiries.length} />
              <SummaryItem icon={CircleHelp} label="접수 대기" value={pendingCount} />
              <SummaryItem icon={ListChecks} label="처리 중" value={progressCount} />
            </div>
            <div className="border-t border-slate-200 p-3">
              <p className="px-3 pt-1 pb-2 text-xs font-bold text-slate-400">
                문의 유형
              </p>
              <nav className="space-y-1" aria-label="문의 유형 필터">
                <InquiryTypeFilter href="/admin/inquiries" active={!selectedType}>
                  전체
                </InquiryTypeFilter>
                {inquiryTypes.map((type) => (
                  <InquiryTypeFilter
                    key={type}
                    href={`/admin/inquiries?type=${type}`}
                    active={selectedType === type}
                  >
                    {inquiryTypeLabels[type]}
                  </InquiryTypeFilter>
                ))}
              </nav>
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="border-b-[0.5px] border-slate-200 px-5 py-5 sm:px-7">
              <p className="text-sm font-bold text-blue-600">문의 목록</p>
              <h2 className="mt-1 font-cafe24 text-2xl font-bold text-slate-950">
                {selectedType ? inquiryTypeLabels[selectedType] : "전체"}{" "}
                {filteredInquiries.length.toLocaleString("ko-KR")}건
              </h2>
            </div>
            <div className="[&>*+*]:border-t-[0.5px] [&>*+*]:border-slate-200">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <AdminInquiryDialog
                    key={inquiry.id}
                    inquiry={inquiry}
                  />
                ))
              ) : (
                <div className="px-6 py-20 text-center">
                  <Inbox className="mx-auto size-9 text-slate-300" aria-hidden="true" />
                  <p className="mt-4 text-sm text-slate-500">해당 상태의 문의가 없습니다.</p>
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
  icon: typeof Inbox;
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

function InquiryTypeFilter({
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
