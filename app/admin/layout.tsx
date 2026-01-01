import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSiteHeader } from "@/components/admin/admin-site-header";
import { AdminProvider } from "@/contexts/admin-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const isAuthenticated =
    cookieStore.get("admin_authenticated")?.value === "true";

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AdminProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AdminSidebar variant="inset" user={user} />
        <SidebarInset>
          <AdminSiteHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AdminProvider>
  );
}
