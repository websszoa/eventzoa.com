import "server-only";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getTodayLabel() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export async function sendAdminFirstLoginEmail() {
  const to = process.env.RESEND_ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!to || !from) {
    throw new Error(
      "RESEND_ADMIN_EMAIL or RESEND_FROM_EMAIL is not configured.",
    );
  }

  return resend.emails.send({
    from,
    to,
    subject: `[eventzoa] ${getTodayLabel()} 새로운 회원 가입`,
    text: "새로운 사용자가 회원 가입을 했습니다. 관리자 페이지에서 확인해주세요.",
  });
}

export async function sendAdminContactEmail() {
  const to = process.env.RESEND_ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!to || !from) {
    throw new Error(
      "RESEND_ADMIN_EMAIL or RESEND_FROM_EMAIL is not configured.",
    );
  }

  return resend.emails.send({
    from,
    to,
    subject: `[eventzoa] ${getTodayLabel()} 새로운 문의 등록`,
    text: "사용자가 새로운 문의를 등록했습니다. 관리자 페이지에서 확인해주세요.",
  });
}
