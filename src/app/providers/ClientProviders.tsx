/** @format */

"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth/AuthContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // keep this file minimal and client-only
  return <AuthProvider>{children}</AuthProvider>;
}
