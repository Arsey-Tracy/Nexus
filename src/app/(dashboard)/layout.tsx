/** @format */
"use client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Roles copied from your original dashboard layout
  const allDashboardRoles = ["doctor", "nurse", "patient", "admin"];
  return (
    <ProtectedRoute allowedRoles={allDashboardRoles}>
      {/* Flex container for the entire screen */}
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar fixed on desktop, hidden on mobile */}
        <DashboardSidebar />

        {/* Main content area: takes up remaining width and is a column */}
        <div className="flex-1 flex flex-col">
          {/* Header (Stick top) */}
          <DashboardHeader />
          {/* Actual content, scrollable */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
