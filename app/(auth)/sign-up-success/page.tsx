import { APP_NAME, APP_ENG_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { SignUpSuccess } from "@/components/auth/sign-up-success";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: `회원가입 완료 | ${APP_NAME} Signup Success`,
  description: `${APP_DESCRIPTION} ${APP_ENG_NAME} 회원가입이 완료되었습니다. 이메일을 확인해주세요.`,
};

export default function Page() {
  return (
    <>
      <PageTitle
        subtitle="success"
        title="회원가입 완료"
        description="이메일을 확인하여 계정을 인증해주세요!"
      />
      <SignUpSuccess />
    </>
  );
}
