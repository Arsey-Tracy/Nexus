/** @format */
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function DashboardIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait for auth init
    if (!user) {
      router.replace("/signin");
      return;
    }

    const role = (user.user_type || user.role || "").toString().toLowerCase();

    // Your dashboard pages are inside (dashboard)/dashboard/<role>/page.tsx
    // so public routes are /dashboard/<role>
    switch (role) {
      case "doctor":
        router.replace("/dashboard/doctor");
        break;
      case "nurse":
        router.replace("/dashboard/nurse");
        break;
      case "patient":
        router.replace("/dashboard/patient");
        break;
      case "admin":
        router.replace("/dashboard/admin");
        break;
      default:
        router.replace("/");
    }
  }, [user, loading, router]);

  // Optionally render a loader while redirecting
  return null;
}
