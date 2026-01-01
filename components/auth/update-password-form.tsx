"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { translateError } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePasswordSchema } from "@/lib/validator";
import { type UpdatePasswordFormValues } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function UpdatePasswordForm() {
  const router = useRouter();
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: UpdatePasswordFormValues) => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast.success("비밀번호가 성공적으로 변경되었습니다!");
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "에러 발생";
      const translatedError = translateError(errorMessage);
      toast.error(translatedError);
    }
  };

  return (
    <div className="auth__container border rounded-2xl p-4 md:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    새로운 비밀번호<span className="star">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력해주세요!"
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
                ? "저장중..."
                : "새로운 비밀번호 저장하기"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
