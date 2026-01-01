"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { submitSchema } from "@/lib/validator";
import { type SubmitFormValues } from "@/lib/types";
import { Mails } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export default function PageSubmit() {
  const form = useForm<SubmitFormValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: SubmitFormValues) => {
    try {
      const supabase = createClient();

      const { error } = await supabase.from("submits").insert({
        email: data.email || null,
        message: data.message,
        status: "pending",
      });

      if (error) throw error;

      toast.success("제보가 성공적으로 전송되었습니다.");
      form.reset();
    } catch (error) {
      console.error("제보 전송 오류:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "제보 전송 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="contact__container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="답장이 필요하다면 입력해주세요!"
                    className="text-muted-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  메시지 <span className="star">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="제보 내용을 입력해주세요"
                    rows={7}
                    className="h-40 text-muted-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            <Mails className="w-4 h-4" aria-hidden="true" />
            {form.formState.isSubmitting ? "전송 중..." : "제보하기"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
