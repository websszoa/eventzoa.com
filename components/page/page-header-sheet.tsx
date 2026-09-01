"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  LogIn,
  LogOut,
  PartyPopper,
  UserRound,
} from "lucide-react";

import PageLoginDialog from "@/components/page/page-login-dialog";
import PageMemberAvatar from "@/components/page/page-member-avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { APP_COPYRIGHT, APP_NAME, APP_SLOGAN } from "@/lib/constants";
import { adminMenu, siteMenu } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";
import { getRandomItem } from "@/lib/utils";

const FACE_IMAGES = Array.from(
  { length: 10 },
  (_, index) => `/face/face${String(index + 1).padStart(2, "0")}.webp`,
);

export type HeaderMember = {
  name: string;
  avatarUrl: string | null;
  visitCount: number;
  role: "user" | "admin";
};

export default function PageHeaderSheet({
  member,
}: {
  member: HeaderMember | null;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [faceImage, setFaceImage] = useState(FACE_IMAGES[0]);

  function handleOpenChange(open: boolean) {
    if (open && !member) {
      setFaceImage(getRandomItem(FACE_IMAGES));
    }

    setIsOpen(open);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsOpen(false);
    router.refresh();
    setIsLoggingOut(false);
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="메뉴 열기"
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              className="size-10 overflow-hidden rounded-full border border-transparent bg-blue-600 p-0 text-white hover:border-blue-600 hover:bg-white hover:text-blue-600 sm:size-11"
            />
          }
        >
          {member ? (
            <PageMemberAvatar
              src={member.avatarUrl}
              fallbackSrc={faceImage}
              name={member.name}
              alt={`${member.name} 프로필`}
              className="size-full border-2 border-blue-100"
              fallbackClassName="bg-blue-100 font-bold text-blue-700"
            />
          ) : (
            <PartyPopper className="size-5" aria-hidden="true" />
          )}
        </SheetTrigger>

        <SheetContent className="gap-0">
        <SheetHeader className="border-b border-blue-100">
          <SheetTitle className="flex items-center gap-3 pb-1 pr-10 text-2xl font-bold tracking-[-0.06em] text-blue-700">
            <span>{APP_NAME}</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            메뉴와 서비스 정보를 확인할 수 있습니다.
          </SheetDescription>
        </SheetHeader>

        <div className="border-b border-blue-100 bg-blue-50 px-6 py-8 text-center">
          <PageMemberAvatar
            src={member?.avatarUrl}
            fallbackSrc={faceImage}
            name={member?.name || "이벤트조아"}
            alt={member ? `${member.name} 프로필` : "프로필 이미지"}
            className="mx-auto mb-3 size-16 border-2 border-blue-100"
            fallbackClassName="bg-blue-100 text-xl font-bold text-blue-700"
          />
          <p className="text-2xl font-bold font-cafe24 text-slate-900">
            {member ? `${member.name}님, 환영합니다!` : "환영합니다!"}
          </p>
          <p className="mt-2 text-sm text-slate-700 font-anyvid">
            {member
              ? `${member.visitCount.toLocaleString("ko-KR")}번째 방문이에요.`
              : "전국의 다양한 축제와 행사 정보를 확인해보세요."}
          </p>
        </div>

        <ScrollArea className="min-h-0 flex-1 py-3">
          <nav aria-label="사이드 메뉴" className="space-y-1 px-2">
            {siteMenu.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3.5 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              );
            })}
            <Separator className="my-2 bg-slate-200" />
            {!member && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginOpen(true);
                }}
                className="h-auto w-full justify-between rounded-lg px-4 py-3.5 text-sm font-normal text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="flex items-center gap-3">
                  <LogIn className="size-4" aria-hidden="true" />
                  <span>로그인</span>
                </span>
              </Button>
            )}
            {member && (
              <>
                <Link
                  href="/mypage"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3.5 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <UserRound className="size-4" aria-hidden="true" />
                    <span>마이페이지</span>
                  </span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="h-auto w-full justify-between rounded-lg px-4 py-3.5 text-sm font-normal text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <LogOut className="size-4" aria-hidden="true" />
                    <span>{isLoggingOut ? "로그아웃 중..." : "로그아웃"}</span>
                  </span>
                </Button>
                {member.role === "admin" && (
                  <>
                    <Separator className="my-2 bg-slate-200" />
                    {adminMenu.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between rounded-lg px-4 py-3.5 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="size-4" aria-hidden="true" />
                            <span>{item.label}</span>
                          </span>
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </nav>
        </ScrollArea>

        <div className="mt-auto flex shrink-0 flex-col items-center border-t border-slate-100 bg-slate-50 px-4 py-4 text-center font-anyvid text-xs leading-5 text-muted-foreground">
          <p className="break-keep">{APP_COPYRIGHT}</p>
          <p className="break-keep">{APP_SLOGAN}</p>
        </div>
        </SheetContent>
      </Sheet>
      <PageLoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
