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
    <ProtectedRoute allowedRoles={allDashboardRoles}>{children}</ProtectedRoute>
  );
}
