import z from "zod";

// 프로필 이름 변경 폼 스키마
export const profileNameSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "이름은 3자 이상 입력해주세요")
    .max(18, "이름은 18자 이내로 입력해주세요"),
});

// 문의하기 폼 스키마
export const contactSchema = z.object({
  user_email: z.email("올바른 이메일 형식을 입력해주세요"),
  message: z
    .string()
    .min(10, "문의 내용을 10자 이상 입력해주세요")
    .max(1000, "문의 내용은 1000자 이내로 입력해주세요"),
});

// 관리자 로그인 폼 스키마
export const adminLoginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

// 이벤트 추가 폼 스키마
export const eventAddSchema = z.object({
  name: z.string().min(1, "이벤트명을 입력해주세요"),
  slug: z
    .string()
    .min(1, "슬러그를 입력해주세요")
    .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 사용 가능합니다"),
  description: z.string().min(1, "설명을 입력해주세요"),
  country: z.string().min(1, "국가를 입력해주세요"),
  region: z.string().min(1, "지역을 입력해주세요"),
  place: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  eventType: z.string().optional(),
  eventScale: z.string().optional(),
  eventSite: z.string().optional(),
  eventProgram: z.string().optional(),
  eventStartAt: z.string().min(1, "이벤트 시작일시를 입력해주세요"),
  eventEndAt: z.string().optional(),
  registrationStatus: z
    .enum(["접수대기", "접수중", "접수마감", "추가접수"])
    .optional(),
  registrationFee: z.enum(["무료", "유료"]),
  registrationStartAt: z.string().optional(),
  registrationEndAt: z.string().optional(),
  registrationAddStartAt: z.string().optional(),
  registrationAddEndAt: z.string().optional(),
  registrationPrice: z
    .array(
      z.object({
        distance: z.string().min(1, "거리를 입력해주세요"),
        price: z.string(),
      }),
    )
    .optional(),
  imagesCover: z.array(z.object({ src: z.string() })).optional(),
  imagesDetail: z.array(z.object({ src: z.string() })).optional(),
  hostsOrganizer: z.string().optional(),
  hostsManage: z.string().optional(),
  hostsSponsor: z.string().optional(),
  hostsPartner: z.string().optional(),
  hostsSouvenir: z.string().optional(),
  hostsPhone: z.string().optional(),
  hostsEmail: z.string().optional(),
  snsKakao: z.string().optional(),
  snsInstagram: z.string().optional(),
  snsBlog: z.string().optional(),
  snsYoutube: z.string().optional(),
});
