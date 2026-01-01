"use client";

import { useAdmin } from "@/contexts/admin-context";
import AdminDashboard from "@/components/admin/admin-dashboard";
import AdminEvents from "@/components/admin/admin-events";
import AdminNotice from "@/components/admin/admin-notice";
import AdminReport from "@/components/admin/admin-report";

export default function AdminPage() {
  const { currentView } = useAdmin();

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <AdminDashboard />;
      case "events":
        return <AdminEvents />;
      case "notice":
        return <AdminNotice />;
      case "report":
        return <AdminReport />;
      default:
        return <AdminDashboard />;
    }
  };

  return <>{renderContent()}</>;
}
