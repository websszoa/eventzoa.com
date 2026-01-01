import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";

export default function PageLogin() {
  return (
    <div className="rounded-lg border border-gray-200 py-16 px-6 text-center">
      <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2 font-paperlogy">
        로그인이 필요합니다.
      </h3>
      <p className="text-sm text-muted-foreground font-nanumNeo mb-4">
        관심 있는 대회를 저장해두고 언제든지 빠르게 확인해보세요.
      </p>
      <Link href="/login">
        <Button variant="destructive" className="font-nanumNeo">
          로그인하기
        </Button>
      </Link>
    </div>
  );
}
