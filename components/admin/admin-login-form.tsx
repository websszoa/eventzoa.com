"use client";

import Link from "next/link";
import { House, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLoginFormValues } from "@/lib/types";
import { adminLoginSchema } from "@/lib/validations";
import { verifyAdminPassword } from "@/lib/actions/action-admin-auth";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const isSubmitting = form.formState.isSubmitting;

  // 비밀번호 검증 및 인증 처리 (서버에서 검증)
  const onSubmit = async (values: AdminLoginFormValues) => {
    try {
      const isValid = await verifyAdminPassword(values.password);
      if (!isValid) {
        toast.error("비밀번호가 올바르지 않습니다.");
        return;
      }
      toast.success("관리자 인증 완료");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "인증 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 font-nanumNeo">
        {/* 타이틀 */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-brand">관리자 로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            관리자 전용 페이지입니다. 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* OTP 비밀번호 입력 */}
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex justify-center mb-4">
                    <InputOTP
                      maxLength={4}
                      pattern="^[0-9]*$"
                      value={field.value ?? ""}
                      onChange={(value) => {
                        field.onChange(value.replace(/\D/g, "").slice(0, 4));
                      }}
                      disabled={isSubmitting}
                      aria-label="4자리 관리자 비밀번호 입력"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="h-12 w-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={1}
                          className="h-12 w-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={2}
                          className="h-12 w-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={3}
                          className="h-12 w-12 text-lg font-semibold"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-center"
                    />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
              >
                <House />
              </Button>
            </Link>

            <Button
              type="submit"
              className="flex-9 gap-2 bg-brand text-white hover:bg-brand/90"
              disabled={isSubmitting}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "확인 중..." : "접속하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
