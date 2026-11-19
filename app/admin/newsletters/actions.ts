"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { newsletterStatusLabels, newsletterStatuses } from "@/lib/newsletter";
import { createAdminClient } from "@/lib/supabase/admin";

const updateNewsletterStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(newsletterStatuses),
});

const deleteNewsletterSchema = z.uuid();

export type AdminNewsletterActionResult = {
  success: boolean;
  message: string;
};

export async function updateNewsletterStatus(
  id: string,
  status: string,
): Promise<AdminNewsletterActionResult> {
  await requireAdmin();

  const parsed = updateNewsletterStatusSchema.safeParse({ id, status });

  if (!parsed.success) {
    return { success: false, message: "변경할 상태를 다시 확인해 주세요." };
  }

  // 구독취소면 취소 시각을 기록하고, 재구독이면 지운다. (테이블 check 제약)
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .update({
      status: parsed.data.status,
      unsubscribed_at:
        parsed.data.status === "unsubscribed" ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update newsletter status", error.code);
    return { success: false, message: "상태 변경 중 문제가 발생했습니다." };
  }

  if (!data) {
    return {
      success: false,
      message: "삭제되었거나 존재하지 않는 구독자입니다.",
    };
  }

  revalidatePath("/admin/newsletters");

  return {
    success: true,
    message: `${newsletterStatusLabels[parsed.data.status]} 상태로 변경했습니다.`,
  };
}

export async function deleteNewsletter(
  id: string,
): Promise<AdminNewsletterActionResult> {
  await requireAdmin();

  const parsed = deleteNewsletterSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, message: "삭제할 구독자를 다시 확인해 주세요." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .delete()
    .eq("id", parsed.data)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete newsletter subscriber", error.code);
    return { success: false, message: "구독자 삭제 중 문제가 발생했습니다." };
  }

  if (!data) {
    return {
      success: false,
      message: "이미 삭제되었거나 존재하지 않는 구독자입니다.",
    };
  }

  revalidatePath("/admin/newsletters");

  return { success: true, message: "구독자를 삭제했습니다." };
}
