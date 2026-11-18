import type { Metadata } from "next";
import { ShieldCheck, UserCheck, UsersRound } from "lucide-react";

import AdminMemberDialog, {
  type AdminMemberDialogData,
} from "@/components/dialog/admin-member-dialog";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "회원 관리 | 이벤트조아",
  robots: { index: false, follow: false },
};

export default async function AdminMembersPage() {
  const adminUser = await requireAdmin();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, display_name, avatar_url, provider, providers, role, status, visit_count, last_visited_at, withdrawn_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(`Failed to load members: ${error.code}`);

  const members = (data || []) as AdminMemberDialogData[];
  const activeCount = members.filter(
    (member) => member.status === "active",
  ).length;
  const adminCount = members.filter((member) => member.role === "admin").length;

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="container">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">
              Admin
            </p>
            <h1 className="mt-2 font-cafe24 text-4xl font-bold text-slate-950 sm:text-5xl">
              회원 관리
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              가입 회원과 계정 상태를 확인하고 관리합니다.
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white lg:sticky lg:top-28">
            <div className="border-b border-slate-200 bg-blue-50 px-5 py-5">
              <p className="text-sm text-blue-700">회원 현황</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                가입 회원과 권한 현황입니다.
              </p>
            </div>
            <div className="divide-y divide-slate-200 px-5">
              <SummaryItem
                icon={UsersRound}
                label="전체 회원"
                value={members.length}
              />
              <SummaryItem
                icon={UserCheck}
                label="정상 회원"
                value={activeCount}
              />
              <SummaryItem
                icon={ShieldCheck}
                label="관리자"
                value={adminCount}
              />
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-end justify-between gap-4 border-b-[0.5px] border-slate-200 px-5 py-5 sm:px-7">
              <div>
                <p className="text-sm text-blue-600">회원 목록</p>
                <h2 className="mt-1 font-cafe24 text-2xl font-bold text-slate-950">
                  전체 {members.length.toLocaleString("ko-KR")}명
                </h2>
              </div>
            </div>
            <div className="[&>*+*]:border-t-[0.5px] [&>*+*]:border-slate-200">
              {members.length > 0 ? (
                members.map((member) => (
                  <AdminMemberDialog
                    key={member.id}
                    member={member}
                    currentAdminId={adminUser.id}
                  />
                ))
              ) : (
                <div className="px-6 py-20 text-center">
                  <UsersRound
                    className="mx-auto size-9 text-slate-300"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-sm text-slate-500">
                    등록된 회원이 없습니다.
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
  icon: typeof UsersRound;
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
