import { z } from "zod";

// 문의하기 폼 스키마
export const contactSchema = z.object({
  name: z
    .string()
    .min(3, "이름은 3글자 이상 입력해주세요")
    .max(5, "이름은 5글자 이하로 입력해주세요")
    .regex(/^[가-힣]+$/, "이름은 한글로만 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  message: z.string().min(10, "문의 내용을 10자 이상 입력해주세요"),
});

// 제보하기 폼 스키마
export const submitSchema = z.object({
  email: z
    .union([z.string().email("올바른 이메일을 입력해주세요"), z.literal("")])
    .optional(),
  message: z.string().min(10, "제보 내용을 10자 이상 입력해주세요"),
});

// 로그인 폼 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

// 회원가입 폼 스키마
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    repeatPassword: z.string().min(1, "확인 비밀번호를 입력해주세요."),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "패스워드가 일치하지 않습니다.",
    path: ["repeatPassword"],
  });

// 비밀번호 찾기 폼 스키마
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
});

// 비밀번호 업데이트 폼 스키마
export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
    .refine(
      (value) =>
        /[a-z]/.test(value) && // 소문자
        /[A-Z]/.test(value) && // 대문자
        /[0-9]/.test(value) && // 숫자
        /[^A-Za-z0-9]/.test(value), // 특수문자
      {
        message:
          "비밀번호는 소문자, 대문자, 숫자, 특수문자를 각각 최소 하나씩 포함해야 합니다.",
      }
    ),
});
