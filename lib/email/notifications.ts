import "server-only";

import type { User } from "@supabase/supabase-js";

import { inquiryTypeLabels, type InquiryType } from "@/lib/contact";
import { sendAdminEmail } from "@/lib/email/client";
import {
  newInquiryEmailTemplate,
  newMemberEmailTemplate,
} from "@/lib/email/templates";
import { createAdminClient } from "@/lib/supabase/admin";

export async function sendInquiryNotification(input: {
  type: InquiryType;
  name: string;
  email: string;
  subject: string;
  relatedUrl: string;
  message: string;
}) {
  return sendAdminEmail({
    subject: `[이벤트조아 문의] ${input.subject}`,
    replyTo: input.email,
    html: newInquiryEmailTemplate({
      ...input,
      type: inquiryTypeLabels[input.type],
    }),
  });
}

export async function sendNewMemberNotification(user: User) {
  const createdAt = Date.parse(user.created_at);
  const isNewMember =
    Number.isFinite(createdAt) && Date.now() - createdAt < 5 * 60 * 1000;

  if (!isNewMember) return;

  const supabase = createAdminClient();
  const claimedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("profiles")
    .update({ signup_notified_at: claimedAt })
    .eq("id", user.id)
    .is("signup_notified_at", null)
    .select("id")
    .maybeSingle();

  if (error || !data) return;

  const metadata = user.user_metadata;
  const name =
    metadata.full_name ||
    metadata.name ||
    user.email?.split("@")[0] ||
    "회원";
  const provider = user.app_metadata.provider || "email";
  const sent = await sendAdminEmail({
    subject: `[이벤트조아 가입] ${name}님이 가입했습니다`,
    html: newMemberEmailTemplate({
      name,
      email: user.email || "이메일 정보 없음",
      provider,
    }),
  });

  if (!sent) {
    await supabase
      .from("profiles")
      .update({ signup_notified_at: null })
      .eq("id", user.id)
      .eq("signup_notified_at", claimedAt);
  }
}
