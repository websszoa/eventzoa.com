import z from "zod";
import {
  adminLoginSchema,
  contactSchema,
  eventAddSchema,
  profileNameSchema,
} from "./validations";

// 프로필 이름 변경 폼 타입
export type ProfileNameFormValues = z.infer<typeof profileNameSchema>;

// 문의하기 폼 타입 (contact)
export type ContactFormValues = z.infer<typeof contactSchema>;

// 관리자 로그인 폼 타입
export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

// 이벤트 추가 폼 타입
export type EventAddFormValues = z.infer<typeof eventAddSchema>;

// 관리자 이벤트 필터 타입
export type CountryFilter = "all" | "domestic" | "international";
export type YearFilter = "all" | number;
export type MonthFilter = "all" | number;
export type AreaFilter = string | null;
export type EventStatusFilter = "all" | "upcoming" | "ongoing" | "ended";
export type PastEventFilter = "exclude" | "include";

// 프로필 타입
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  signup_provider: string;
  role: string;
  visit_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// 문의 타입 (관리자 페이지에서 사용)
export interface Contact {
  id: string;
  user_id: string;
  user_email?: string | null;
  message: string;
  status: "pending" | "progress" | "resolved" | "closed";
  admin_reply: string | null;
  admin_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// 이벤트 목록
export type RegistrationStatus =
  | "접수대기"
  | "접수중"
  | "접수마감"
  | "추가접수";

export type EventImages = {
  cover?: string[];
  detail?: string[];
};

export type EventLocation = {
  country?: string | null;
  region?: string | null;
  place?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export type EventHosts = {
  organizer?: string | null;
  manage?: string | null;
  sponsor?: string | null;
  partner?: string | null;
  souvenir?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type EventSNS = {
  kakao?: string | null;
  instagram?: string | null;
  blog?: string | null;
  youtube?: string | null;
};

export type EventRegistrationPrice = {
  distance: string;
  price: number | null;
}[];

export interface Event {
  id: string;

  year: number;
  month: number;
  country: string;
  region: string;

  name: string;
  slug: string;
  description: string;

  event_start_at: string | null;
  event_end_at: string | null;
  event_scale: number | null;
  event_type: string | null;
  event_site: string | null;
  event_program: string | null;

  registration_status: RegistrationStatus | null;
  registration_start_at: string | null;
  registration_end_at: string | null;
  registration_add_start_at: string | null;
  registration_add_end_at: string | null;
  registration_price: EventRegistrationPrice | null;

  images: EventImages | null;
  location: EventLocation | null;
  hosts: EventHosts | null;
  sns: EventSNS | null;

  comment_count: number;
  view_count: number;
  heart_count: number;
  favorite_count: number;
  share_count: number;
  alert_count: number;
  created_at: string;
  updated_at: string;
}
