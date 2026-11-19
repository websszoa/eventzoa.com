import "server-only";

import { Resend } from "resend";

const ADMIN_EMAIL = "webstoryboy@naver.com";
// 뉴스레터 구독 알림과 구독자 답장(구독 취소 요청 등)을 받는 주소
const NEWSLETTER_ADMIN_EMAIL = "helpzoa@naver.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "이벤트조아 <noreply@eventzoa.com>";

async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error("Failed to send admin email", {
        name: error.name,
        message: error.message,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Failed to send admin email",
      error instanceof Error
        ? { name: error.name, message: error.message }
        : "UnknownError",
    );
    return false;
  }
}

export async function sendAdminEmail({
  subject,
  html,
  replyTo,
}: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  return sendEmail({ to: ADMIN_EMAIL, subject, html, replyTo });
}

export async function sendInquiryReplyEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return sendEmail({
    to,
    subject,
    html,
    replyTo: ADMIN_EMAIL,
  });
}

export async function sendNewsletterAdminEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  return sendEmail({ to: NEWSLETTER_ADMIN_EMAIL, subject, html });
}

// 구독자에게 보내는 메일. 답장하면 뉴스레터 관리자 메일로 간다.
export async function sendSubscriberEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return sendEmail({ to, subject, html, replyTo: NEWSLETTER_ADMIN_EMAIL });
}
