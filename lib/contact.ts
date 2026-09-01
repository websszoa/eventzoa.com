import { z } from "zod";

export const inquiryTypes = [
  "general",
  "registration",
  "correction",
  "report",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const inquiryStatuses = [
  "pending",
  "in_progress",
  "resolved",
  "closed",
] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

export const inquiryTypeLabels: Record<InquiryType, string> = {
  general: "문의사항",
  registration: "등록문의",
  correction: "수정요청",
  report: "불편신고",
};

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  pending: "접수 대기",
  in_progress: "처리 중",
  resolved: "답변 완료",
  closed: "종료",
};

export const inquiryFormCopy: Record<
  InquiryType,
  {
    eyebrow: string;
    title: string;
    description: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
  }
> = {
  general: {
    eyebrow: "General Inquiry",
    title: "문의사항 작성",
    description: "서비스 이용 중 궁금한 내용을 작성해 주세요.",
    subjectPlaceholder: "무엇이 궁금하신가요?",
    messagePlaceholder: "문의하실 내용을 자세히 작성해 주세요.",
    submitLabel: "문의 접수하기",
  },
  registration: {
    eyebrow: "Event Registration",
    title: "등록문의 작성",
    description: "등록할 행사의 기본 정보와 확인 가능한 공식 주소를 알려주세요.",
    subjectPlaceholder: "등록할 축제 또는 행사명을 입력해 주세요",
    messagePlaceholder: "행사 일정, 장소, 주최자와 주요 프로그램을 작성해 주세요.",
    submitLabel: "등록문의 보내기",
  },
  correction: {
    eyebrow: "Information Correction",
    title: "수정요청 작성",
    description: "수정이 필요한 페이지 주소와 정확한 변경 내용을 알려주세요.",
    subjectPlaceholder: "수정이 필요한 축제 또는 행사명을 입력해 주세요",
    messagePlaceholder: "현재 정보와 수정되어야 할 내용을 구체적으로 작성해 주세요.",
    submitLabel: "수정요청 보내기",
  },
  report: {
    eyebrow: "Issue Report",
    title: "불편신고 작성",
    description: "오류가 발생한 상황이나 이용 중 불편했던 점을 알려주세요.",
    subjectPlaceholder: "어떤 불편이 있었는지 간단히 적어주세요",
    messagePlaceholder: "발생한 문제, 이용 환경과 재현 방법을 자세히 작성해 주세요.",
    submitLabel: "불편신고 접수하기",
  },
};

export const contactSchema = z.object({
  type: z.enum(inquiryTypes, { message: "문의 유형을 선택해 주세요." }),
  name: z
    .string()
    .trim()
    .min(2, "이름을 2자 이상 입력해 주세요.")
    .max(30, "이름은 30자 이하로 입력해 주세요."),
  email: z
    .string()
    .trim()
    .email("올바른 이메일 주소를 입력해 주세요.")
    .max(120, "이메일은 120자 이하로 입력해 주세요."),
  subject: z
    .string()
    .trim()
    .min(2, "제목을 2자 이상 입력해 주세요.")
    .max(100, "제목은 100자 이하로 입력해 주세요."),
  relatedUrl: z
    .union([z.literal(""), z.string().trim().url("올바른 URL을 입력해 주세요.")]),
  message: z
    .string()
    .trim()
    .min(10, "문의 내용을 10자 이상 입력해 주세요.")
    .max(3000, "문의 내용은 3,000자 이하로 입력해 주세요."),
  privacyAccepted: z
    .boolean()
    .refine((value) => value, "개인정보 수집 및 이용에 동의해 주세요."),
  website: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
