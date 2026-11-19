"use server";

import { APP_SITE_URL } from "@/lib/constants";
import {
  sendNewsletterAdminEmail,
  sendSubscriberEmail,
} from "@/lib/email/client";
import {
  newNewsletterSubscriberEmailTemplate,
  newsletterWelcomeEmailTemplate,
} from "@/lib/email/templates";
import { newsletterSchema } from "@/lib/newsletter";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubscribeNewsletterResult =
  { success: true } | { success: false; message: string };

function formatKoreanDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export async function subscribeNewsletter(
  input: unknown,
): Promise<SubscribeNewsletterResult> {
  const parsed = newsletterSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "입력 내용을 다시 확인해 주세요." };
  }

  const data = parsed.data;
  let supabase;

  try {
    supabase = createAdminClient();
  } catch {
    console.error(
      "Supabase newsletter environment variables are not configured.",
    );
    return {
      success: false,
      message: "구독 기능을 준비 중입니다. 잠시 후 다시 이용해 주세요.",
    };
  }

  // sql/supabase-newsletter.sql 의 subscribe_newsletter RPC (service role 전용)
  const { data: subscriberId, error } = await supabase.rpc(
    "subscribe_newsletter",
    {
      subscriber_email: data.email,
      subscriber_age: data.age,
      subscriber_acquisition_source: data.acquisitionSource,
      subscriber_content_preference: data.contentPreference || null,
      subscriber_subscription_source: data.subscriptionSource,
      privacy_agreed: true,
      ads_agreed: true,
    },
  );

  if (error || !subscriberId) {
    if (error?.message.includes("already_subscribed")) {
      return {
        success: false,
        message: "이미 뉴스레터를 구독 중인 이메일이에요.",
      };
    }

    console.error("Failed to subscribe newsletter", error?.code);
    return {
      success: false,
      message: "구독 정보를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
    };
  }

  // 메일 발송 실패는 구독 성공에 영향을 주지 않는다.
  const email = data.email.toLowerCase();
  const subscribedAt = formatKoreanDateTime();
  await Promise.allSettled([
    sendNewsletterAdminEmail({
      subject: `[이벤트조아 뉴스레터] 신규 구독 - ${email}`,
      html: newNewsletterSubscriberEmailTemplate({
        email,
        age: data.age,
        acquisitionSource: data.acquisitionSource,
        contentPreference: data.contentPreference,
        subscriptionSource: data.subscriptionSource,
        subscribedAt,
      }),
    }),
    sendSubscriberEmail({
      to: email,
      subject: "[이벤트조아] 뉴스레터 구독을 환영합니다!",
      html: newsletterWelcomeEmailTemplate({
        email,
        subscribedAt,
        siteUrl: APP_SITE_URL,
      }),
    }),
  ]);

  return { success: true };
}
