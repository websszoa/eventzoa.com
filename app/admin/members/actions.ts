"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const updateMemberSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "suspended", "withdrawn"]),
});

export type UpdateMemberResult = {
  success: boolean;
  message: string;
};

export async function updateMember(
  memberId: string,
  role: string,
  status: string,
): Promise<UpdateMemberResult> {
  const adminUser = await requireAdmin();
  const parsed = updateMemberSchema.safeParse({ memberId, role, status });

  if (!parsed.success) {
    return { success: false, message: "회원 설정을 다시 확인해 주세요." };
  }

  if (parsed.data.memberId === adminUser.id) {
    return {
      success: false,
      message: "현재 로그인한 관리자 계정은 직접 변경할 수 없습니다.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role, status: parsed.data.status })
    .eq("id", parsed.data.memberId);

  if (error) {
    console.error("Failed to update member", error.code);
    return { success: false, message: "회원 정보 변경 중 문제가 발생했습니다." };
  }

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${parsed.data.memberId}`);

  return { success: true, message: "회원 설정을 변경했습니다." };
}
