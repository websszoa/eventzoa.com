// 축제 페이지(/festivals) 필터와 주소(쿼리스트링)를 서로 변환한다.
// 서버(page.tsx)·클라이언트(page-festival.tsx)·메인 페이지 링크에서 함께 쓴다.

export const ALL_STATUS = "전체";
export const ALL_PRICE = "전체 가격";
export const DEFAULT_SORT = "빠른 개최순";

export type FestivalFilters = {
  keyword: string;
  /** 비어 있으면 전체 지역 */
  regions: string[];
  price: string;
  status: string;
  includePast: boolean;
  month: number | null;
  sort: string;
};

export const defaultFestivalFilters: FestivalFilters = {
  keyword: "",
  regions: [],
  price: ALL_PRICE,
  status: ALL_STATUS,
  includePast: false,
  month: null,
  sort: DEFAULT_SORT,
};

const statusCodes: Record<string, string> = {
  "일정 미정": "tbd",
  "개최 예정": "upcoming",
  "진행 중": "ongoing",
  종료: "ended",
};
const priceCodes: Record<string, string> = { 무료: "free", 유료: "paid" };
const sortCodes: Record<string, string> = { 이름순: "name", 지역순: "region" };

function invert(record: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [value, key]),
  );
}

const statusByCode = invert(statusCodes);
const priceByCode = invert(priceCodes);
const sortByCode = invert(sortCodes);

type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || "";
}

export function parseFestivalFilters(
  params: Record<string, SearchParamValue>,
): FestivalFilters {
  const status = statusByCode[first(params.status)] ?? ALL_STATUS;
  const month = Number(first(params.month));

  return {
    keyword: first(params.keyword),
    regions: first(params.region)
      .split(",")
      .map((region) => region.trim())
      .filter(Boolean),
    price: priceByCode[first(params.price)] ?? ALL_PRICE,
    status,
    // 종료된 축제를 고르면 지난 축제도 함께 보여야 한다.
    includePast: first(params.past) === "include" || status === "종료",
    month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : null,
    sort: sortByCode[first(params.sort)] ?? DEFAULT_SORT,
  };
}

/** 기본값과 다른 필터만 쿼리스트링으로 만든다. */
export function serializeFestivalFilters(filters: Partial<FestivalFilters>) {
  const params = new URLSearchParams();

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.regions?.length) params.set("region", filters.regions.join(","));
  if (filters.price && priceCodes[filters.price]) {
    params.set("price", priceCodes[filters.price]);
  }
  if (filters.status && statusCodes[filters.status]) {
    params.set("status", statusCodes[filters.status]);
  }
  if (filters.includePast && filters.status !== "종료") {
    params.set("past", "include");
  }
  if (filters.month) params.set("month", String(filters.month));
  if (filters.sort && sortCodes[filters.sort]) {
    params.set("sort", sortCodes[filters.sort]);
  }

  // 지역명의 쉼표(,)는 그대로 두어 주소를 읽기 쉽게 한다.
  return params.toString().replaceAll("%2C", ",");
}

export function getFestivalsHref(filters: Partial<FestivalFilters> = {}) {
  const query = serializeFestivalFilters(filters);
  return query ? `/festivals?${query}` : "/festivals";
}
