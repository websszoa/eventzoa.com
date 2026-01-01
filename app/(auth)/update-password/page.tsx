import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { APP_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: `비밀번호 재설정 | ${APP_NAME}`,
  description:
    "계정의 비밀번호를 안전하게 변경하세요. 새 비밀번호를 설정하면 즉시 적용됩니다.",
};

export default function Page() {
  return (
    <>
      <PageTitle
        subtitle="password"
        title="비밀번호 재설정"
        description="계정의 비밀번호를 안전하게 변경하세요."
      />
      <UpdatePasswordForm />
    </>
  );
}
