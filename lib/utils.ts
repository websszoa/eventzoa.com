import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

/*
 * 날짜(문자열 또는 Date)를 한국식 표기("yyyy년 M월 d일(요일)")로 변환합니다.
 * 값이 없거나 올바른 날짜가 아니면 "-"를 반환합니다.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = DAY_NAMES[d.getDay()];
  return `${year}년 ${month}월 ${day}일(${dayName})`;
}

/*
 * 이벤트 시작일과 종료일을 "yyyy년 M월 d일(요일) ~ yyyy년 M월 d일(요일)" 형태로 변환합니다.
 * 종료일이 없으면 시작일만 반환하고, 시작일이 없거나 잘못되면 "-"를 반환합니다.
 */
export function formatDateRange(
  startDate: string | Date | null | undefined,
  endDate?: string | Date | null,
): string {
  const start = formatDate(startDate);
  if (start === "-") return "-";

  const end = formatDate(endDate);
  if (end === "-") return start;

  return `${start} ~ ${end}`;
}

/*
 * 이벤트 시작일과 종료일 사이의 기간을 "N일간" 형태로 반환합니다.
 * - 당일 행사(같은 날)이면 "당일"
 * - 날짜가 없거나 잘못된 경우 null 반환
 */
export function getEventDuration(
  startDate: string | Date | null | undefined,
  endDate?: string | Date | null,
): string | null {
  if (!startDate || !endDate) return null;

  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffDays = Math.round(
    (endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "당일";
  return `${diffDays + 1}일간`;
}

/*
 * 이벤트 참가비 목록을 받아 가격 라벨 문자열을 반환합니다.
 * - 항목이 없거나 모두 0/null이면 "무료"
 * - 유료 항목이 있으면 가장 첫 번째 금액 기준 "N원~" 형태
 */
export function getPriceLabel(
  price: { distance: string; price: number | null }[] | null | undefined,
): string {
  if (!price || price.length === 0) return "무료";
  const hasPrice = price.some((p) => p.price !== null && p.price > 0);
  if (!hasPrice) return "무료";
  const first = price.find((p) => p.price !== null && p.price > 0);
  return first ? `${first.price?.toLocaleString()}원~` : "무료";
}

/*
 * 이벤트 상태별 랜덤 멘트 목록
 * - before  : 이벤트 시작 전 (D-N)
 * - active  : 이벤트 당일 또는 진행 중
 * - ended   : 이벤트 종료 후
 */
const DDAY_MESSAGES = {
  before: [
    "아직 몇 일 남았어요! 🎭",
    "미리 준비하세요! 📅",
    "곧 시작해요! 두근두근 💓",
    "달력에 표시해두세요! 🗓️",
    "설레는 날이 다가와요! ✨",
    "놓치지 마세요! 🎯",
    "기대되지 않나요? 🌟",
    "카운트다운 시작! ⏳",
    "친구와 함께 가요! 👫",
    "이 이벤트 놓치면 후회해요! 😮",
  ],
  active: [
    "지금 바로 가세요! 🎪",
    "지금 진행하고 있어요! 🎉",
    "축제가 한창이에요! 🎊",
    "오늘이 바로 그 날! 🎈",
    "지금 가면 딱이에요! 🌈",
    "현장의 열기가 뜨거워요! 🔥",
    "지금 출발하세요! 🚀",
    "놓치면 아쉬워요! 😢",
    "즐거운 시간이 기다려요! 🎵",
    "지금 이 순간을 즐기세요! 🥳",
  ],
  ended: [
    "아쉽게 종료됐어요 😢",
    "다음 이벤트를 기대해요! 🌱",
    "즐거운 추억이 됐겠죠? 📸",
    "또 다른 이벤트를 찾아봐요! 🔍",
    "아쉽지만 끝났어요 😔",
    "다음엔 꼭 참여해요! 🙌",
    "좋은 시간이었길 바라요! 💝",
    "이런, 조금 늦었어요! ⏰",
    "다음 시즌을 기대해봐요! 🎭",
    "끝났지만 기억은 남아요! 💫",
  ],
} as const;

// 시드 문자열로부터 결정론적 인덱스를 계산 (Math.random() 대신 사용)
function pickBySeed<T>(arr: readonly T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return arr[hash % arr.length];
}

/*
 * 이벤트 시작일/종료일을 기준으로 D-day 라벨과 고정 멘트를 반환합니다.
 * - 시작 전  : { label: "D-7",   message: "..." }
 * - 당일     : { label: "축제중", message: "..." }
 * - 진행 중  : { label: "축제중", message: "..." }
 * - 종료     : { label: "종료",   message: "..." }
 * - 날짜 없음: null (표시하지 않음)
 * seed: 이벤트 ID 등 고정값 — 리렌더 시 멘트가 바뀌지 않도록 결정론적 선택
 */
export function getEventDdayInfo(
  startDate: string | Date | null | undefined,
  endDate?: string | Date | null,
  seed?: string,
): { label: string; message: string } | null {
  if (!startDate) return null;

  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  if (Number.isNaN(start.getTime())) return null;

  // seed가 없으면 시작일 문자열을 시드로 사용
  const msgSeed = seed ?? String(startDate);

  const now = new Date();
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );

  const diffDays = Math.round(
    (startDay.getTime() - nowDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  // 시작 전
  if (diffDays > 0) {
    return { label: `D-${diffDays}`, message: pickBySeed(DDAY_MESSAGES.before, msgSeed) };
  }

  // 당일 또는 진행 중
  if (diffDays === 0) {
    return { label: "축제중", message: pickBySeed(DDAY_MESSAGES.active, msgSeed) };
  }

  if (endDate) {
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    if (!Number.isNaN(endDay.getTime()) && nowDay <= endDay) {
      return { label: "축제중", message: pickBySeed(DDAY_MESSAGES.active, msgSeed) };
    }
  }

  // 종료
  return { label: "종료", message: pickBySeed(DDAY_MESSAGES.ended, msgSeed) };
}

/*
 * 이벤트 시작일을 기준으로 D-day 문자열을 반환합니다.
 * - 시작 전 : "D-7" 형태 (숫자가 클수록 멀리 있음)
 * - 당일     : "D-Day"
 * - 진행 중  : "진행중" (시작일 이후 & 종료일 이전)
 * - 종료     : "종료"
 * - 날짜 없음: "-"
 */
export function getEventDday(
  startDate: string | Date | null | undefined,
  endDate?: string | Date | null,
): string {
  if (!startDate) return "-";

  const now = new Date();
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  if (Number.isNaN(start.getTime())) return "-";

  // 날짜 단위로 비교 (시간 제거)
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );

  const diffMs = startDay.getTime() - nowDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-Day";

  // 시작일이 지난 경우: 종료일 확인
  if (endDate) {
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    if (!Number.isNaN(endDay.getTime()) && nowDay <= endDay) return "진행중";
  }

  return "종료";
}

/*
 * 현재 시간을 기준으로 이벤트 진행 상태를 계산합니다.
 * 시작 전이면 "예정", 종료일이 지났으면 "종료", 그 외에는 "진행중"을 반환합니다.
 * 시작일이 없거나 잘못된 날짜면 "-"를 반환합니다.
 */
export function getEventProgressStatus(
  startDate: string | Date | null | undefined,
  endDate?: string | Date | null,
): "예정" | "진행중" | "종료" | "-" {
  if (!startDate) return "-";

  const now = new Date();
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  if (Number.isNaN(start.getTime())) return "-";

  if (now < start) return "예정";

  if (endDate) {
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;
    if (!Number.isNaN(end.getTime()) && now > end) {
      return "종료";
    }
  }

  return "진행중";
}

/*
 * 이벤트의 진행 상태를 영문 키로 반환합니다. (admin-event 필터와 stats에서 공유)
 * - upcoming : 시작 전
 * - ongoing  : 진행 중 (종료일 없을 땐 시작 당일 포함)
 * - ended    : 종료
 */
export function getEventStatus(
  startDate: string | null | undefined,
  endDate?: string | null,
): "upcoming" | "ongoing" | "ended" {
  if (!startDate) return "ended";

  const now = new Date();
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "ended";
  if (start > now) return "upcoming";

  if (endDate) {
    const end = new Date(endDate);
    return !Number.isNaN(end.getTime()) && end >= now ? "ongoing" : "ended";
  }

  // 종료일 없음: 시작일이 오늘이면 진행중, 과거면 종료
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return startDay >= today ? "ongoing" : "ended";
}

/*
 * `datetime-local` 입력값 또는 일반 날짜 문자열을 ISO 문자열로 변환합니다.
 * 관리자 등록/수정 폼에서 받은 날짜를 DB의 TIMESTAMPTZ 컬럼으로 저장할 때 사용합니다.
 * 값이 없거나 올바른 날짜가 아니면 null을 반환합니다.
 */
export function toIsoString(value?: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

/*
 * ISO 날짜 문자열을 `datetime-local` 입력 형식("YYYY-MM-DDTHH:mm")으로 변환합니다.
 * 수정 다이얼로그에서 기존 이벤트 날짜를 폼 기본값으로 채울 때 사용합니다.
 * 값이 없거나 올바른 날짜가 아니면 빈 문자열을 반환합니다.
 */
export function toDateTimeLocal(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}
