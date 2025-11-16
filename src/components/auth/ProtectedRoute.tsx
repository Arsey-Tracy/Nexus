/** @format */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Skeleton } from "../ui/skeleton";

export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait until auth is initialized
    if (!user) {
      router.replace("/signin");
      return;
    }
    const userRole = (user.user_type || user.role || "")
      .toString()
      .toLowerCase();
    const allowed = allowedRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      router.replace("/unauthorized");
      return;
    }
  }, [user, loading, allowedRoles, router]);

  // show a loader while auth initializes to avoid blank page
  if (loading) {
    return (
      // we can add a skeleton loader here
      <div className="flex items-center justify-center p-8">
        <Skeleton></Skeleton>
        {/* <div>Loading...</div> */}
      </div>
    );
  }

  if (!user) return null;

  const userRole = (user.user_type || user.role || "").toString().toLowerCase();
  if (!allowedRoles.map((r) => r.toLowerCase()).includes(userRole)) return null;

  return <>{children}</>;
}
