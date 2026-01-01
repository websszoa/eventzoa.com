"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getRandomFaceImage, translateError } from "@/lib/utils";
import { signUpSchema } from "@/lib/validator";
import { type SignUpFormValues } from "@/lib/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Divider } from "../ui/divider";
import { GoogleLoginButton } from "./google-login-button";
import { GithubLoginButton } from "./github-login-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const supabase = createClient();

    try {
      const baseDisplayName = data.email.split("@")[0];
      const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
      const displayName = `${baseDisplayName}${randomSuffix}`;
      const randomImagePath = getRandomFaceImage();

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            display_name: displayName,
            avatar_url: randomImagePath,
            admin_authenticated: false,
          },
        },
      });

      if (error) throw error;

      toast.success("회원가입이 완료되었습니다!");
      router.push("/sign-up-success");
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    비밀번호<span className="star">*</span>
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

            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    확인 비밀번호<span className="star">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="확인 비밀번호를 입력해주세요!"
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
              {form.formState.isSubmitting ? "회원가입 중..." : "회원가입"}
            </Button>
          </div>
        </form>
      </Form>

      <Divider text="또는" />

      <GoogleLoginButton />
      <GithubLoginButton />
    </div>
  );
}
