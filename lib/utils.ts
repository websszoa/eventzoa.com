import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserMetadata } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//face01~10 중 랜덤으로 선택하여 이미지 경로 반환
export function getRandomFaceImage(): string {
  const randomNum = Math.floor(Math.random() * 10) + 1;
  return `/face/face${String(randomNum).padStart(2, "0")}.png`;
}

// 날짜 포맷팅 함수 (예: 2025년 3월 13일)
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

// 사용자 메타데이터에서 표시 이름을 추출
export function getDisplayName(
  userMetadata?: UserMetadata | null,
  fallback = "사용자"
): string {
  return (
    userMetadata?.display_name ||
    userMetadata?.full_name ||
    userMetadata?.user_name ||
    userMetadata?.nickname ||
    fallback
  );
}

// 사용자 메타데이터에서 아바타 URL을 추출
export function getAvatarUrl(
  userMetadata?: UserMetadata | null,
  fallback?: string
): string {
  return (
    userMetadata?.avatar_url ||
    userMetadata?.profile_image ||
    fallback ||
    getRandomFaceImage()
  );
}

// 에러 메시지를 한글로 번역하는 함수
export function translateError(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    "Email not confirmed":
      "이메일이 인증되지 않았습니다. 이메일을 확인하여 계정을 인증해주세요.",
    "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
    "User already registered": "이미 등록된 사용자입니다.",
    "Email rate limit exceeded":
      "이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
    "Error sending confirmation email":
      "인증 이메일 전송에 실패했습니다. 이메일 주소를 확인하고 잠시 후 다시 시도해주세요.",
    "An error occurred": "오류가 발생했습니다.",
    "Invalid email": "올바른 이메일 형식이 아닙니다.",
    "Password should be at least 6 characters":
      "비밀번호는 최소 6자 이상이어야 합니다.",
    "User not found": "사용자를 찾을 수 없습니다.",
    "Too many requests": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    "Auth session missing!":
      "인증 세션이 없습니다. 비밀번호 재설정 링크를 다시 요청해주세요.",
    "New password should be different from the old password.":
      "새 비밀번호는 기존 비밀번호와 달라야 합니다.",
    "Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789, !@#$%^&*()_+-=[]{};':\"|<>?,./`~.":
      "비밀번호는 소문자, 대문자, 숫자, 특수문자를 각각 최소 하나씩 포함해야 합니다.",
  };

  // 정확한 매칭
  if (errorMap[errorMessage]) {
    return errorMap[errorMessage];
  }

  // 보안 대기 시간 에러 메시지 처리 (동적 시간 추출)
  const securityWaitPattern =
    /for security purposes, you can only request this after (\d+) seconds?/i;
  const securityMatch = errorMessage.match(securityWaitPattern);
  if (securityMatch) {
    const seconds = securityMatch[1];
    return `보안을 위해 ${seconds}초 후에 다시 요청할 수 있습니다.`;
  }

  // 부분 매칭 (대소문자 무시)
  const lowerMessage = errorMessage.toLowerCase();
  for (const [key, value] of Object.entries(errorMap)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  // 매칭되지 않으면 원본 메시지 반환
  return errorMessage;
}

/**
 * 이벤트 날짜 표현
 * 반환값: "2025-11-15(토)" 또는 "2025-11-15(토) ~ 2025-11-17(월)"
 */
export function formatEventDate(start?: string, end?: string) {
  if (!start) return "";

  // start와 end가 같거나 end 없음 → start만 표시
  if (!end || start === end) {
    return formatDate(start);
  }

  // start와 end가 다르면 범위 표시
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

/**
 * 이벤트 날짜를 항상 "2025-10-24(금) ~ 2025-10-26(일)" 형태로 출력
 * end가 없거나 start와 같아도 동일한 포맷 유지
 */
export function formatEventDateRange(start?: string, end?: string) {
  if (!start) return "";

  const startStr = formatDate(start);
  const endStr = end ? formatDate(end) : startStr;

  return `${startStr} ~ ${endStr}`;
}

/**
 * 이벤트 상태 계산
 * 반환값: "D-10" | "D-Day" | "진행중" | "종료"
 */
export function getEventStatus(start: string, end: string) {
  if (!start) return "정보없음";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = end ? new Date(end) : new Date(start);
  endDate.setHours(0, 0, 0, 0);

  // 종료됨
  if (today > endDate) return "종료";

  // 진행중
  if (today >= startDate && today <= endDate) return "진행중";

  // D-Day
  const diff = Math.ceil(
    (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

// 이벤트 상태 색상 설정
export function getEventStatusColor(status: string) {
  switch (status) {
    case "종료":
      return "bg-gray-500";
    case "진행중":
      return "bg-red-600";
    case "D-Day":
      return "bg-red-600";
    default:
      return "bg-blue-700";
  }
}
