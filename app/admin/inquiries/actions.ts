"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { inquiryStatuses } from "@/lib/contact";
import { createAdminClient } from "@/lib/supabase/admin";

const updateInquiryStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(inquiryStatuses),
});

export type UpdateInquiryStatusResult = {
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
