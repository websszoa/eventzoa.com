"use client";

import { Candy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/contexts/sheet-context";
import { useAuth } from "@/contexts/auth-context";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import HeaderInfo from "./header-info";
import HeaderSheet from "./header-sheet";
import HeaderUser from "./header-user";
import HeaderNav from "./header-nav";

export default function HeaderRight() {
  const { isOpen, setIsOpen } = useSheet();
  const { user } = useAuth();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full hover:border hover:border-brand bg-brand text-white hover:bg-white hover:text-brand overflow-hidden p-0"
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isOpen}
          >
            <Candy className="w-5 h-5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <HeaderSheet user={user} />
          <HeaderUser userId={user?.id} isOpen={isOpen} />
          <HeaderNav user={user} />
          <HeaderInfo />
        </SheetContent>
      </Sheet>
    </>
  );
}
