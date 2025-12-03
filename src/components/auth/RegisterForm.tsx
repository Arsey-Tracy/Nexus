/** @format */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleSelector } from "./RoleSelector";
import { registerUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import { AuthLayout } from "./AuthLayout";
import { User, Mail, KeyRound, EyeOff, Eye, Phone, Link } from "lucide-react";

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
  };

  // const handleRoleSelect = (role: string) => {
  //   setSelectedRole(role);
  // };

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
      setError("Please select a role");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
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
      // backend returns { user, access, refresh, ... }
      const access = response.access;
      const user = response.user;
      if (user && access) {
        login(user, access); // persists user/token and updates context
      }

      // then redirect using user.user_type (not route-group path)
      // router.replace(user.user_type === "doctor" ? "/doctor" : "/patient");
      redirectByRole(selectedRole);
    } catch (err: unknown) {
      // Try to extract server validation errors
      if (typeof err === "string") {
        try {
          const parsed = JSON.parse(err);
          // If parsed is object of errors -> join messages
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
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Choose your role and enter your details to get started."
    >
      <div className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-sm text-red-700 p-3 rounded-md">
                  {error}
                </div>
              )}
              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First, select your role
                </label>
                <RoleSelector
                  onSelect={setSelectedRole}
                  selected={selectedRole}
                />
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Account Credentials */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="pl-10 pr-10 w-full"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </Button>
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?
                <Link
                  href="/signin"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AuthLayout>
  );
}
