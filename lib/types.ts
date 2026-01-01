import { z } from "zod";
import {
  contactSchema,
  forgotPasswordSchema,
  loginSchema,
  signUpSchema,
  submitSchema,
  updatePasswordSchema,
} from "./validator";

/**
 * 사용자 메타데이터 타입 정의
 * Supabase auth의 user_metadata에서 사용하는 타입
 *
 * 이메일 로그인: display_name, avatar_url, email
 * 구글 로그인: full_name, avatar_url, email
 * 깃허브 로그인: user_name, avatar_url, email
 * 카카오 로그인: nickname, profile_image, email
 */
export interface UserMetadata {
  avatar_url?: string;
  display_name?: string;
  full_name?: string;
  name?: string;
  user_name?: string;
  nickname?: string;
  email?: string;
  profile_image?: string;
}

// 문의하기 폼 타입
export type ContactFormValues = z.infer<typeof contactSchema>;

// 제보하기 폼 타입
export type SubmitFormValues = z.infer<typeof submitSchema>;

// 로그인 폼 타입
export type LoginFormValues = z.infer<typeof loginSchema>;

// 회원가입 폼 타입
export type SignUpFormValues = z.infer<typeof signUpSchema>;

//비밀번호 찾기 폼 타입
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

//비밀번호 업데이트 폼 타입
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

// 이벤트
export interface EventImages {
  main: string;
  sub?: string[];
}

export interface EventSchedule {
  start: string;
  end?: string;
  time?: string;
  price?: string;
}

export interface EventRegistration {
  start?: string;
  end?: string;
  status?: string;
  text?: string;
  site?: string;
  price?: Record<string, number>;
}

export interface EventLocation {
  text?: string;
  latitude?: number | string;
  longitude?: number | string;
}

export interface EventHosts {
  organizer?: string;
  operator?: string;
  sponsor?: string[] | string;
  home?: string;
  tel?: string;
  email?: string;
}

export interface EventSNS {
  instagram?: string;
  kakao?: string;
  youtube?: string;
  blog?: string;
}

export interface EventItem {
  id?: number;
  year: number;
  month: number;
  region: string;

  name: string;
  slug: string;
  type: string;
  description?: string;
  highlights?: string[];

  images?: EventImages;
  event: EventSchedule;
  registration?: EventRegistration;
  programs?: string[];
  location?: EventLocation;
  hosts?: EventHosts;
  sns?: EventSNS;

  comment_count?: number;
  view_count?: number;
  favorite_count?: number;
  like_count?: number;
  share_count?: number;

  created_at?: string;
  updated_at?: string;
}
