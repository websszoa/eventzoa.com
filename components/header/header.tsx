import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 상태 확인 (디버깅용)
  // console.log("사용자 정보:", user);

  return (
    <header className="header__container">
      <div className="flex items-center justify-between">
        <HeaderLeft />
        <HeaderRight user={user} />
      </div>
    </header>
  );
}
