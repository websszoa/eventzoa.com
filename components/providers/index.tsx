"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginProvider } from "@/contexts/context-login";
import { SheetProvider } from "@/contexts/context-sheet";
import { AuthProvider } from "@/contexts/context-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoginProvider>
        <SheetProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SheetProvider>
      </LoginProvider>
    </AuthProvider>
  );
}
