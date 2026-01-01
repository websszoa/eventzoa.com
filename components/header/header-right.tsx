"use client";

import { APP_NAME } from "@/lib/constants";
import { Button } from "../ui/button";
import { Candy } from "lucide-react";
import { useSheet } from "@/contexts/sheet-context";
import { LogoutButton } from "../auth/logout-button";
import type { User } from "@supabase/supabase-js";
import HeaderInfo from "./header-info";
import HeaderUser from "./header-user";
import HeaderNav from "./header-nav";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderRightProps {
  user: User | null;
}

export default function HeaderRight({ user }: HeaderRightProps) {
  const { isOpen, setIsOpen } = useSheet();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full hover:border bg-brand text-white hover:bg-white hover:text-brand overflow-hidden p-0"
          >
            <Candy />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="border-b border-brand/10">
            <SheetTitle className="font-paperlogy text-xl uppercase font-bold text-brand flex items-center gap-2">
              {APP_NAME}
              {user && <LogoutButton />}
            </SheetTitle>
            <SheetDescription className="sr-only">
              메뉴 및 사용자 정보를 확인할 수 있습니다.
            </SheetDescription>
          </SheetHeader>

          {/* 사용자 정보 섹션 */}
          <HeaderUser user={user} />

          {/* 메뉴 */}
          <HeaderNav user={user} />

          {/* 앱 정보 */}
          <HeaderInfo />
        </SheetContent>
      </Sheet>
    </>
  );
}
