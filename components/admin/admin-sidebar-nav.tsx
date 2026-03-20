"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminMenuItems } from "@/lib/menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {adminMenuItems.map((item) => {
          // /admin 루트는 정확히 일치, 하위 메뉴는 startsWith로 활성 여부 판단
          const isActive =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <SidebarMenuItem key={item.href}>
              {/* 활성 항목은 brand 색상으로 강조 */}
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                isActive={isActive}
                className="
                    hover:text-brand hover:bg-brand/10
                    data-[active=true]:bg-brand
                    data-[active=true]:text-white
                  "
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span className="font-nanumNeo text-sm">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
