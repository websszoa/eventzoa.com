import { SignUpForm } from "@/components/auth/sign-up-form";
import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: `회원가입 | ${APP_NAME}`,
  description: `${APP_ENG_NAME} 서비스 이용을 위해 지금 회원가입하세요.`,
};

export default function Page() {
  return (
    <>
      <PageTitle
        subtitle="signup"
        title="회원가입"
        description="서비스 이용을 위해 지금 회원가입하세요."
      />
      <SignUpForm />
    </>
  );
}
