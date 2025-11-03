/** @format */

// /** @format */
// "use client";

// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// import React from "react";

// // This layout applies protection to all child routes (doctor, patient, admin, etc.)
// export default function DashboardSubLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // The roles here should encompass ALL possible roles that can access ANY dashboard.
//   // The individual pages can have their own ProtectedRoute wrapper if they need more specific roles,
//   // but this top-level one handles the basic "are you a logged-in user?" check.
//   const allDashboardRoles = ["doctor", "nurse", "patient", "admin"];

//   return (
//     <ProtectedRoute allowedRoles={allDashboardRoles}>{children}</ProtectedRoute>
//   );
// }
// app/(dashboard)/layout.tsx (UPDATED from your original layout.tsx)
/** @format */
"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import React from "react";

// This layout applies protection to all child routes (doctor, patient, admin, etc.)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allDashboardRoles = ["doctor", "nurse", "patient", "admin"]; //

  return (
    <ProtectedRoute allowedRoles={allDashboardRoles}>
      {/* Main dashboard container: flex min-h-screen */}
      <div className="flex min-h-screen bg-gray-50">
        {/* 1. Sidebar on the left (Hidden on mobile via 'hidden md:flex' in component) */}
        <DashboardSidebar />

        {/* 2. Main Content Area: fills remaining space and organizes children vertically */}
        <div className="flex-1 flex flex-col">
          {/* 3. Header on the top with Avatar Dropdown */}
          <DashboardHeader />

          {/* 4. The actual page content, wrapped in padding and scrollable */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
