import Link from "next/link";
import { ChevronDown, History } from "lucide-react";

export type PastFestivalLink = {
  slug: string;
  title: string;
  date: string;
};

// 기본 목록에서 빠진 지난 축제를 접힌 링크 목록으로 남겨 둔다.
// 화면은 간결하게 유지하면서 검색엔진이 모든 상세 페이지로 이어지는 링크를 따라갈 수 있다.
export default function PagePastFestivalLinks({
  festivals,
}: {
  festivals: PastFestivalLink[];
}) {
  if (festivals.length === 0) return null;

  return (
    <details className="group mt-8 rounded-3xl bg-white ring-1 ring-slate-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-5 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 font-cafe24 text-xl font-bold text-slate-950">
          <History className="size-5 text-blue-600" aria-hidden="true" />
          지난 축제
          <span className="font-sans text-sm font-normal text-slate-500">
            {festivals.length}개
          </span>
        </span>
        <ChevronDown
          className="size-5 text-slate-400 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul className="grid gap-x-6 gap-y-2 border-t border-slate-100 px-6 py-5 text-sm sm:grid-cols-2">
        {festivals.map((festival) => (
          <li key={festival.slug} className="min-w-0">
            <Link
              href={`/festivals/${festival.slug}`}
              className="flex min-w-0 items-baseline gap-2 text-slate-700 transition-colors hover:text-blue-600"
            >
              <span className="truncate">{festival.title}</span>
              <span className="shrink-0 text-xs text-slate-400">
                {festival.date}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
