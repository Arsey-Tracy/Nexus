/** @format */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Removed unused imports that might cause undefined errors
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleSelector } from "./RoleSelector";
import { registerUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import { AuthLayout } from "./AuthLayout";
import {
  User,
  Mail,
  KeyRound,
  EyeOff,
  Eye,
  Phone,
  Link as LinkIcon,
  AlertCircle,
  ArrowRight,
  Loader,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const redirectByRole = (userType: string) => {
    switch (userType) {
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
        router.replace("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedRole) {
      setError("Please select a user role to continue.");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match. Please check again.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        user_type: selectedRole,
      };

      const response = await registerUser(payload);
      const access = response.access;
      const user = response.user;
      if (user && access) {
        login(user, access);
      }

      redirectByRole(selectedRole);
    } catch (err: unknown) {
      if (typeof err === "string") {
        try {
          const parsed = JSON.parse(err);
          if (typeof parsed === "object" && parsed !== null) {
            const messages = Object.entries(parsed)
              .map(([k, v]) =>
                Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`
              )
              .join(" | ");
            setError(messages);
          } else setError(parsed);
        } catch {
          setError(err);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our health platform today."
    >
      <div className="w-full px-4 pb-8">
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-6 p-0">
              {error && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-600" />
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">
                    I am a...
                  </label>
                  {!selectedRole && (
                    <span className="text-xs text-blue-600 font-medium">
                      * Required
                    </span>
                  )}
                </div>
                <RoleSelector
                  onSelect={(role) => {
                    setSelectedRole(role);
                    if (error) setError(null);
                  }}
                  selected={selectedRole}
                />
              </div>

              <div
                className={`space-y-5 transition-opacity duration-300 ${
                  !selectedRole ? "opacity-60 grayscale-[0.5]" : "opacity-100"
                }`}
              >
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground font-medium tracking-wider">
                      Personal Info
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        placeholder="First Name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        placeholder="Last Name"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground font-medium tracking-wider">
                      Account Security
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative group">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="pl-9 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                    </div>

                    <div className="relative group">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirm_password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="pl-9 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-0 mt-6">
              <Button
                className="w-full h-11 text-base font-medium shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <LinkIcon className="inline h-3 w-3 mr-1" />
                <a
                  href="/signin"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign In
                </a>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AuthLayout>
  );
}
