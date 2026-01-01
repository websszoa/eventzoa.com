"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AdminView = "dashboard" | "events" | "notice" | "report";

interface AdminContextType {
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  return (
    <AdminContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
