import { LoginForm } from "@/components/auth/login-form";
import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: `로그인 | ${APP_NAME}`,
  description: `${APP_ENG_NAME} 서비스를 이용하려면 로그인해 주세요.`,
};

export default function Page() {
  return (
    <>
      <PageTitle
        subtitle="login"
        title="로그인"
        description="계정에 로그인하여 서비스를 이용하세요."
      />
      <LoginForm />
    </>
  );
}
