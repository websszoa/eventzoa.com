"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { inquiryStatuses } from "@/lib/contact";
import { sendInquiryReplyEmail } from "@/lib/email/client";
import { inquiryReplyEmailTemplate } from "@/lib/email/templates";
import { createAdminClient } from "@/lib/supabase/admin";

const updateInquiryStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(inquiryStatuses),
});

const deleteInquirySchema = z.number().int().positive();

const replyInquirySchema = z.object({
  id: z.number().int().positive(),
  reply: z
    .string()
    .trim()
    .min(2, "답변 내용을 2자 이상 입력해 주세요.")
    .max(3000, "답변 내용은 3,000자 이하로 입력해 주세요."),
});

export type UpdateInquiryStatusResult = {
  success: boolean;
  message: string;
};

export type DeleteInquiryResult = {
  success: boolean;
  message: string;
};

export type ReplyInquiryResult = {
  success: boolean;
  message: string;
};

export async function updateInquiryStatus(
  id: number,
  status: string,
): Promise<UpdateInquiryStatusResult> {
  await requireAdmin();

  const parsed = updateInquiryStatusSchema.safeParse({ id, status });

  if (!parsed.success) {
    return { success: false, message: "변경할 상태를 다시 확인해 주세요." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("Failed to update inquiry status", error.code);
    return { success: false, message: "상태 변경 중 문제가 발생했습니다." };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${parsed.data.id}`);

  return { success: true, message: "문의 상태를 변경했습니다." };
}

export async function deleteInquiry(id: number): Promise<DeleteInquiryResult> {
  await requireAdmin();

  const parsed = deleteInquirySchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, message: "삭제할 문의를 다시 확인해 주세요." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", parsed.data)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete inquiry", error.code);
    return { success: false, message: "문의 삭제 중 문제가 발생했습니다." };
  }

  if (!data) {
    return { success: false, message: "이미 삭제되었거나 존재하지 않는 문의입니다." };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${parsed.data}`);

  return { success: true, message: "문의를 삭제했습니다." };
}

export async function replyToInquiry(
  id: number,
  reply: string,
): Promise<ReplyInquiryResult> {
  await requireAdmin();

  const parsed = replyInquirySchema.safeParse({ id, reply });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "답변 내용을 다시 확인해 주세요.",
    };
  }

  const supabase = createAdminClient();
  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .select("name, email, subject")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load inquiry for reply", error.code);
    return { success: false, message: "문의 정보를 확인하지 못했습니다." };
  }

  if (!inquiry) {
    return { success: false, message: "삭제되었거나 존재하지 않는 문의입니다." };
  }

  const sent = await sendInquiryReplyEmail({
    to: inquiry.email,
    subject: `[이벤트조아 답변] ${inquiry.subject}`,
    html: inquiryReplyEmailTemplate({
      name: inquiry.name,
      inquirySubject: inquiry.subject,
      reply: parsed.data.reply,
    }),
  });

  if (!sent) {
    return { success: false, message: "메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return { success: true, message: `${inquiry.email}로 답변을 보냈습니다.` };
}
