const styles = {
  body: "margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a",
  wrap: "max-width:640px;margin:0 auto;padding:32px 20px",
  card: "overflow:hidden;border:1px solid #e2e8f0;border-radius:24px;background:#ffffff",
  header: "padding:28px;background:#eff6ff;text-align:center",
  content: "padding:28px",
  label: "margin:0 0 6px;color:#2563eb;font-size:12px;font-weight:700",
  value: "margin:0;color:#334155;font-size:14px;line-height:1.7",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label: string, value: string) {
  return `<div style="margin-bottom:20px"><p style="${styles.label}">${escapeHtml(label)}</p><p style="${styles.value}">${escapeHtml(value)}</p></div>`;
}

function layout(title: string, description: string, content: string) {
  return `<div style="${styles.body}"><div style="${styles.wrap}"><div style="${styles.card}"><div style="${styles.header}"><p style="margin:0 0 8px;color:#2563eb;font-size:13px;font-weight:700">EVENTZOA</p><h1 style="margin:0;font-size:26px">${escapeHtml(title)}</h1><p style="margin:10px 0 0;color:#64748b;font-size:14px">${escapeHtml(description)}</p></div><div style="${styles.content}">${content}</div></div></div></div>`;
}

export function newMemberEmailTemplate({
  name,
  email,
  provider,
}: {
  name: string;
  email: string;
  provider: string;
}) {
  return layout(
    "새로운 회원이 가입했어요",
    "이벤트조아 신규 회원 알림입니다.",
    row("회원 이름", name) + row("이메일", email) + row("가입 경로", provider),
  );
}

export function newInquiryEmailTemplate({
  type,
  name,
  email,
  subject,
  relatedUrl,
  message,
}: {
  type: string;
  name: string;
  email: string;
  subject: string;
  relatedUrl: string;
  message: string;
}) {
  return layout(
    "새로운 문의가 접수됐어요",
    "관리자 페이지에서 문의 상태를 관리할 수 있습니다.",
    row("문의 유형", type) +
      row("문의자", name) +
      row("이메일", email) +
      row("제목", subject) +
      (relatedUrl ? row("관련 URL", relatedUrl) : "") +
      row("문의 내용", message),
  );
}

export function inquiryReplyEmailTemplate({
  name,
  inquirySubject,
  reply,
}: {
  name: string;
  inquirySubject: string;
  reply: string;
}) {
  return layout(
    "문의하신 내용에 답변드립니다",
    "이벤트조아 고객지원 답변입니다.",
    row("문의자", `${name}님`) +
      row("문의 제목", inquirySubject) +
      row("답변 내용", reply) +
      `<p style="margin:8px 0 0;padding-top:20px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.7">추가 문의가 있다면 이 메일에 답장해 주세요.</p>`,
  );
}
