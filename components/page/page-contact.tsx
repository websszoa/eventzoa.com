"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { contactSchema } from "@/lib/validator";
import { type ContactFormValues } from "@/lib/types";
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

export default function PageContact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const supabase = createClient();

      const { error } = await supabase.from("contacts").insert({
        name: data.name,
        email: data.email,
        message: data.message,
        status: "pending",
      });

      if (error) throw error;

      toast.success("문의가 성공적으로 전송되었습니다.");
      form.reset();
    } catch (error) {
      console.error("문의 전송 오류:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "문의 전송 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="contact__container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이름 <span className="star">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="이름을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이메일 <span className="star">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="이메일을 적어주세요"
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
                    placeholder="문의 내용을 입력해주세요"
                    rows={7}
                    className="h-40"
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
            {form.formState.isSubmitting ? "전송 중..." : "문의하기"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
