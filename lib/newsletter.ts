import { z } from "zod";

// sql/supabase-newsletter.sql 의 check 제약과 값이 같아야 한다.
export const newsletterAges = [
  "10대",
  "20대",
  "30대",
  "40대",
  "50대",
  "60대 이상",
] as const;

export const newsletterAcquisitionSources = [
  "검색",
  "인스타그램·SNS",
  "지인 추천",
  "커뮤니티·카페",
  "축제 현장",
  "기타",
] as const;

export const newsletterSubscriptionSources = [
  "메인 구독 배너",
  "뉴스레터 페이지",
  "축제 상세페이지",
] as const;

export type NewsletterSubscriptionSource =
  (typeof newsletterSubscriptionSources)[number];

// 팝업(클라이언트)과 서버 액션이 같은 규칙으로 검사한다.
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해 주세요.")
    .max(320, "이메일이 너무 길어요.")
    .email("올바른 이메일 형식을 입력해 주세요."),
  age: z.enum(newsletterAges, { error: "나이대를 선택해 주세요." }),
  acquisitionSource: z.enum(newsletterAcquisitionSources, {
    error: "알게 된 경로를 선택해 주세요.",
  }),
  contentPreference: z.string().trim().max(500, "500자 이하로 입력해 주세요."),
  subscriptionSource: z.enum(newsletterSubscriptionSources),
  consent: z.literal(true, { error: "뉴스레터 수신에 동의해 주세요." }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const newsletterStatuses = ["subscribed", "unsubscribed"] as const;

export type NewsletterStatus = (typeof newsletterStatuses)[number];

export const newsletterStatusLabels: Record<NewsletterStatus, string> = {
  subscribed: "구독중",
  unsubscribed: "구독취소",
};
