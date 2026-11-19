import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

// 구독중인 이메일을 CSV로 내려받는다. (뉴스레터 발송용)
function toCsvCell(value: string | null) {
  const text = value ?? "";
  // 엑셀 수식 실행 방지 + 따옴표 이스케이프
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET() {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select("email, age, acquisition_source, subscription_source, created_at")
    .eq("status", "subscribed")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to export newsletters", error.code);
    return new Response("구독자 목록을 불러오지 못했습니다.", { status: 500 });
  }

  const header = ["이메일", "나이대", "알게 된 경로", "신청 위치", "구독일"];
  const rows = (data || []).map((row) =>
    [
      row.email,
      row.age,
      row.acquisition_source,
      row.subscription_source,
      row.created_at,
    ]
      .map(toCsvCell)
      .join(","),
  );
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());

  // BOM을 붙여 엑셀에서 한글이 깨지지 않게 한다.
  return new Response(`﻿${[header.join(","), ...rows].join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="eventzoa-newsletter-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
