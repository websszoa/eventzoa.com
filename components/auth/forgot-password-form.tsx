"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { translateError } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/validator";
import { type ForgotPasswordFormValues } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast.success("비밀번호 재설정 링크가 발송되었습니다!");
      setSuccess(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "에러 발생";
      const translatedError = translateError(errorMessage);
      toast.error(translatedError);
    }
  };

  return (
    <div className="auth__container">
      {success ? (
        <div className="border border-gray-200 p-6 rounded-lg font-nanumNeo">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* 성공 아이콘 */}
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
              <Image
                src="/face/face03.png"
                alt="avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>

            {/* 제목 */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                이메일을 확인해주세요
              </h2>
              <p className="text-sm text-muted-foreground">
                비밀번호 재설정 링크가 발송되었습니다.
              </p>
            </div>

            {/* 안내 메시지 */}
            <div className="w-full space-y-4 text-left bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    이메일을 확인해주세요
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    입력하신 이메일 주소로 비밀번호 재설정 링크가
                    발송되었습니다. 이메일을 확인하시고 링크를 클릭하여
                    비밀번호를 재설정해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-2xl p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 mt-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        이메일<span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="sample@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "전송중..."
                    : "비밀번호 재설정 메일 보내기"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
