import { createClient } from "@/lib/supabase/server";
import PageTitle from "@/components/page/page-title";
import PageProfile from "@/components/page/page-profile";
import PageLogin from "@/components/page/page-login";

export const metadata = {
  title: "런조아 내 정보 | RunZoa Profile",
  description:
    "내 프로필 정보를 확인하고 수정할 수 있는 페이지입니다. 러닝 라이프를 나만의 방식으로 관리해보세요.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PageTitle
        subtitle="RunZoa Profile"
        title="런조아 내 정보"
        description="내 프로필 정보를 확인하고 수정할 수 있는 페이지입니다."
      />
      {!user ? <PageLogin /> : <PageProfile user={user} />}
    </>
  );
}
