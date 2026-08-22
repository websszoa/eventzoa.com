"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, PartyPopper } from "lucide-react";
import { APP_COPYRIGHT, APP_NAME, APP_SLOGAN } from "@/lib/constants";
import { siteMenu } from "@/lib/navigation";
import { getRandomItem } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FACE_IMAGES = Array.from(
  { length: 10 },
  (_, index) => `/face/face${String(index + 1).padStart(2, "0")}.webp`,
);

export default function PageHeaderSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [faceImage, setFaceImage] = useState(FACE_IMAGES[0]);

  function handleOpenChange(open: boolean) {
    if (open) {
      setFaceImage(getRandomItem(FACE_IMAGES));
    }

    setIsOpen(open);
  }

  return (
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
            className="size-10 sm:size-11 rounded-full border border-transparent bg-blue-600 text-white hover:border-blue-600 hover:bg-white hover:text-blue-600"
          />
        }
      >
        <PartyPopper className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent className="gap-0">
        <SheetHeader className="border-b border-blue-100">
          <SheetTitle className="flex items-center gap-3 pb-1 pr-10 text-2xl font-bold tracking-[-0.06em] text-blue-700">
            <span>{APP_NAME}</span>
            <Button
              size="sm"
              nativeButton={false}
              render={<a href="#login" onClick={() => setIsOpen(false)} />}
              className="mt-1 rounded-full bg-blue-600 px-4 h-7 text-[13px] font-nanum font-bold text-white hover:bg-blue-500"
            >
              로그인
            </Button>
          </SheetTitle>
          <SheetDescription className="sr-only">
            메뉴와 서비스 정보를 확인할 수 있습니다.
          </SheetDescription>
        </SheetHeader>

        <div className="border-b border-blue-100 bg-blue-50 px-6 py-8 text-center">
          <Avatar className="mx-auto mb-3 size-16 border-2 border-blue-100">
            <AvatarImage src={faceImage} alt="프로필 이미지" />
            <AvatarFallback className="bg-blue-100 text-xl font-bold text-blue-700">
              이
            </AvatarFallback>
          </Avatar>
          <p className="text-2xl font-bold font-cafe24 text-slate-900">
            환영합니다!
          </p>
          <p className="mt-2 text-sm text-slate-700 font-anyvid">
            전국의 다양한 축제와 행사 정보를 확인해보세요.
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
          </nav>
        </ScrollArea>

        <div className="mt-auto flex shrink-0 flex-col items-center border-t border-slate-100 bg-slate-50 px-4 py-4 text-center font-anyvid text-xs leading-5 text-muted-foreground">
          <p className="break-keep">{APP_COPYRIGHT}</p>
          <p className="break-keep">{APP_SLOGAN}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
