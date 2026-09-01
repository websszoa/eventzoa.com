import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Link2, Mail, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import PageAdminInquiryStatus from "@/components/page/page-admin-inquiry-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin";
import {
  inquiryStatusLabels,
  inquiryTypeLabels,
  type InquiryStatus,
  type InquiryType,
} from "@/lib/contact";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "문의 상세 | 이벤트조아",
  robots: { index: false, follow: false },
};

type InquiryDetail = {
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

function getSafeRelatedUrl(value: string | null) {
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

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const inquiryId = Number(id);

  if (!Number.isInteger(inquiryId) || inquiryId < 1) notFound();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select(
      "id, type, name, email, subject, related_url, message, status, created_at, updated_at",
    )
    .eq("id", inquiryId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load inquiry: ${error.code}`);
  if (!data) notFound();

  const inquiry = data as InquiryDetail;
  const relatedUrl = getSafeRelatedUrl(inquiry.related_url);

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="container max-w-5xl">
        <Link
          href="/admin/inquiries"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          문의 목록
        </Link>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="gap-0 rounded-3xl border-slate-200 bg-white py-0">
            <CardHeader className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-blue-50 text-blue-700">
                  {inquiryTypeLabels[inquiry.type] || inquiry.type}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {inquiryStatusLabels[inquiry.status]}
                </Badge>
                <span className="text-xs text-slate-400">#{inquiry.id}</span>
              </div>
              <CardTitle className="mt-4 font-cafe24 text-3xl leading-tight font-bold text-slate-950 sm:text-4xl">
                {inquiry.subject}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6 sm:p-8">
              <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
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
                <div>
                  <p className="text-xs font-bold text-slate-500">관련 페이지</p>
                  <a
                    href={relatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 break-all text-sm font-bold text-blue-700 hover:underline"
                  >
                    <Link2 className="size-4 shrink-0" aria-hidden="true" />
                    {relatedUrl}
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-500">문의 내용</p>
                <div className="mt-3 whitespace-pre-wrap break-words rounded-2xl border border-slate-200 p-5 text-sm leading-7 text-slate-700 sm:p-6">
                  {inquiry.message}
                </div>
              </div>
            </CardContent>
          </Card>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 lg:sticky lg:top-28">
            <p className="text-sm font-bold text-blue-600">처리 상태</p>
            <h2 className="mt-2 font-cafe24 text-2xl font-bold text-slate-950">
              문의 상태 변경
            </h2>
            <p className="mt-2 mb-5 text-xs leading-5 text-slate-500">
              문의 처리 단계에 맞게 상태를 변경해 주세요.
            </p>
            <PageAdminInquiryStatus
              inquiryId={inquiry.id}
              initialStatus={inquiry.status}
            />
          </aside>
        </div>
      </div>
    </main>
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
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-blue-700 ring-1 ring-slate-200">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="mt-1 break-all text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
