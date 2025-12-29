/** @format */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthLayout } from "./AuthLayout";
// Replaced Loader2 with Loader to improve compatibility with older lucide-react versions
import {
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  AlertCircle,
  Loader,
  LogIn,
} from "lucide-react";
import NextLink from "next/link";

export function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const redirectByRole = (userType: string) => {
    switch (userType) {
      case "doctor":
        router.replace("/dashboard/doctor");
        break;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detectRoleFromResponse = (res: any): string | undefined => {
    if (res?.user?.user_type) return res.user.user_type;
    const profile = res?.profile;
    if (!profile) return undefined;
    if ("blood_type" in profile || "emergency_contact" in profile)
      return "patient";
    if ("specialization" in profile || "license_number" in profile) {
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
      const access = data?.access ?? data?.token ?? null;
      const user = data?.user ?? null;

      if (login && user && access) {
        login(user, access);
      } else if (access) {
        localStorage.setItem("access", access);
        if (data?.refresh) localStorage.setItem("refresh", data.refresh);
      }

      const role = detectRoleFromResponse(data) ?? user?.user_type;
      redirectByRole(role);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
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
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your health dashboard."
    >
      <div className="w-full px-4">
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-5 pt-2">
              {error && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-600" />
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="relative group">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className="pl-10 pr-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-5 pt-2">
              <Button
                className="w-full h-11 text-base font-medium shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <NextLink
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Create Account
                </NextLink>
              </p>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AuthLayout>
  );
}
