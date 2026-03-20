import type {
  AreaFilter,
  CountryFilter,
  EventStatusFilter,
  MonthFilter,
  PastEventFilter,
  YearFilter,
} from "@/lib/types";

interface EventNoticeProps {
  totalCount: number;
  countryFilter: CountryFilter;
  yearFilter: YearFilter;
  monthFilter: MonthFilter;
  areaFilter: AreaFilter;
  statusFilter: EventStatusFilter;
  pastFilter: PastEventFilter;
  searchQuery: string;
}

const STATUS_LABELS: Record<EventStatusFilter, string> = {
  all: "",
  upcoming: "예정",
  ongoing: "진행",
  ended: "종료",
};

export default function EventNotice({
  totalCount,
  countryFilter,
  yearFilter,
  monthFilter,
  areaFilter,
  statusFilter,
  pastFilter,
  searchQuery,
}: EventNoticeProps) {
  // 활성 필터 레이블 수집
  const activeFilters: string[] = [];

  if (countryFilter === "domestic") activeFilters.push("국내");
  if (countryFilter === "international") activeFilters.push("해외");
  if (yearFilter !== "all") activeFilters.push(`${yearFilter}년`);
  if (monthFilter !== "all") activeFilters.push(`${monthFilter}월`);
  if (areaFilter !== null) activeFilters.push(areaFilter);
  if (statusFilter !== "all") activeFilters.push(STATUS_LABELS[statusFilter]);
  if (pastFilter === "include") activeFilters.push("지난이벤트 포함");

  const filterText =
    activeFilters.length > 0 ? ` (필터: ${activeFilters.join(", ")}` : "";
  const searchText = searchQuery.trim()
    ? `${activeFilters.length > 0 ? ", " : " ("}검색: ${searchQuery.trim()}`
    : "";
  const suffix = filterText || searchText ? ")" : "";

  return (
    <div className="event__notice">
      <div className="my-4 rounded border border-gray-200/80 bg-slate-50/80 px-4 py-3 text-center text-sm text-muted-foreground font-anyvid">
        <p>
          현재 <span className="text-red-500 font-semibold">{totalCount}</span>개의 이벤트가 있습니다.
          {filterText}
          {searchText}
          {suffix}
        </p>
      </div>
    </div>
  );
}
