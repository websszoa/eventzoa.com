"use server";

import { createClient } from "@supabase/supabase-js";

import { contactSchema } from "@/lib/contact";
import { sendInquiryNotification } from "@/lib/email/notifications";

export type ContactActionResult = {
  success: boolean;
  message: string;
};

export async function submitInquiry(input: unknown): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "입력 내용을 다시 확인해 주세요." };
  }

  if (parsed.data.website) {
    return { success: true, message: "문의가 정상적으로 접수되었습니다." };
  }

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    console.error("Supabase contact environment variables are not configured.");
    return {
      success: false,
      message: "문의 접수 기능을 준비 중입니다. 잠시 후 다시 이용해 주세요.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { type, name, email, subject, relatedUrl, message } =
    parsed.data;
  const { error } = await supabase.from("inquiries").insert({
    type,
    name,
    email,
    subject,
    related_url: relatedUrl || null,
    message,
  });

  if (error) {
    console.error("Failed to submit inquiry", error.code);
    return {
      success: false,
      message: "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  await sendInquiryNotification({
    type,
    name,
    email,
    subject,
    relatedUrl,
    message,
  });

  return {
    success: true,
    message: "문의가 정상적으로 접수되었습니다. 확인 후 답변드리겠습니다.",
  };
}
