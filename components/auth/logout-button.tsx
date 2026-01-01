"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useSheet } from "@/contexts/sheet-context";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const { setIsOpen } = useSheet();

  const logout = async () => {
    const supabase = createClient();
    setIsOpen(false); // Sheet 닫기
    await supabase.auth.signOut();
    toast.success("로그아웃 되었습니다.");
    router.push("/login");
  };

  return (
    <button
      className="text-[12px] rounded-full px-2.5 font-paperlogy font-normal bg-brand text-white h-6 cursor-pointer hover:bg-brand/90"
      onClick={logout}
    >
      로그아웃
    </button>
  );
}
