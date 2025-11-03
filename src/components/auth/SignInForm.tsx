/** @format */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AuthLayout } from "./AuthLayout";
import { Eye, EyeOff, KeyRound, Link, Mail } from "lucide-react";

/**
 * SignInForm
 * - calls backend loginUser
 * - stores tokens via AuthContext.login
 * - redirects user to role dashboard after successful login
 *
 * The redirect logic uses (in order):
 * 1) user.user_type returned by the backend (if present)
 * 2) heuristic based on profile fields returned by the backend
 * 3) fallback to / (home)
 */

export function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // snippet to use in RegisterForm/SignInForm redirectByRole
  const redirectByRole = (userType: string) => {
    switch (userType) {
      case "doctor":
        router.replace("/dashboard/doctor");
        break;
      // case "nurse":
      //   router.replace("/dashboard/nurse");
      //   break;
      case "patient":
        router.replace("/dashboard/patient");
        break;
      case "admin":
        router.replace("/dashboard/admin");
        break;
      default:
        router.replace("/dashboard/");
    }
  };

  const detectRoleFromResponse = (res: any): string | undefined => {
    // 1) direct value if backend returned it
    if (res?.user?.user_type) return res.user.user_type;
    // 2) profile shape heuristics
    const profile = res?.profile;
    if (!profile) return undefined;
    if ("blood_type" in profile || "emergency_contact" in profile)
      return "patient";
    if ("specialization" in profile || "license_number" in profile) {
      // backend doesn't distinguish doctor/nurse in profile schema;
      // prefer the user_type returned on user if it exists, otherwise default to doctor
      return res?.user?.user_type ?? "doctor";
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, password });
      // expected backend shape: { user, profile, access, refresh, ... }
      const access = data?.access ?? data?.token ?? null;
      const user = data?.user ?? null;

      // store in AuthContext if available
      if (login && user && access) {
        login(user, access);
      } else if (access) {
        // fallback: store tokens directly
        localStorage.setItem("access", access);
        if (data?.refresh) localStorage.setItem("refresh", data.refresh);
      }

      const role = detectRoleFromResponse(data) ?? user?.user_type;
      redirectByRole(role);
    } catch (err: any) {
      // try to extract backend validation errors
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        // sometimes thrown as stringified json
        try {
          const parsed = JSON.parse(err);
          if (typeof parsed === "object" && parsed !== null) {
            const messages = Object.entries(parsed)
              .map(([k, v]) =>
                Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`
              )
              .join(" | ");
            setError(messages);
          } else {
            setError(parsed as string);
          }
        } catch {
          setError(err);
        }
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your account."
    >
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-sm text-red-700 p-3 rounded-md">
                  {error}
                </div>
              )}
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {/* Password Input */}
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Don't have an account? Sign Up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AuthLayout>
  );
}
