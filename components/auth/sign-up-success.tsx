import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function SignUpSuccess() {
  return (
    <div className="auth__container border border-gray-200 p-4 md:p-6 rounded-lg font-nanumNeo">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* 성공 아이콘 */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
          <Image
            src="/face/face04.png"
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {/* 제목 */}
        <p className="text-sm text-muted-foreground">
          이름은 임의로 설정되며, <br />내 정보에서 언제든지 수정할 수 있습니다.
        </p>

        {/* 안내 메시지 */}
        <div className="w-full space-y-4 text-left bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                이메일 인증이 필요합니다
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                가입하신 이메일 주소로 인증 링크가 발송되었습니다. 이메일을
                확인하시고 링크를 클릭하여 계정을 활성화해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className="w-full space-y-2 text-left">
          <p className="text-sm text-muted-foreground">
            이메일이 보이지 않나요?
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>스팸 폴더를 확인해주세요</li>
            <li>이메일 주소가 정확한지 확인해주세요</li>
            <li>회원가입이 되어 있다면 메일은 가지 않습니다.</li>
          </ul>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">로그인 페이지로 이동</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
