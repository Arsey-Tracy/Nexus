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
import React from "react";

// This layout applies protection to all child routes (doctor, patient, admin, etc.)
export default function DashboardSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The roles here should encompass ALL possible roles that can access ANY dashboard.
  const allDashboardRoles = ["doctor", "nurse", "patient", "admin"];

  return (
    <ProtectedRoute allowedRoles={allDashboardRoles}>
      {children}
    </ProtectedRoute>
  );
}
