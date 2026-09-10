/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/Spinner";
import { getAdminUsers, AdminUser } from "@/lib/api/admin";
import { registerUser } from "@/lib/api/auth";
import { getMediaUrl } from "@/lib/utils";
import { APIError, extractErrors } from "@/lib/api/api";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 8;

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("https://example.com/register?ref=invite");
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    user_type: "patient",
  });
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  useEffect(() => {
    const buildInviteLink = () => {
      if (typeof window === "undefined") return;
      setInviteLink(`${window.location.origin}/register?ref=invite`);
    };

    buildInviteLink();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAdminUsers();
      setUsers(allUsers);
      setError(null);
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 401) {
          setError("Unauthorized. Please sign in as an admin.");
        } else {
          setError(extractErrors(err));
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.trim()?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.trim()?.charAt(0).toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  const copyToClipboard = async (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setSubmissionMessage("Copied to clipboard.");
    } catch {
      setSubmissionMessage("Unable to copy. Please copy manually.");
    }
  };

  const handleCopyEmail = (email: string) => {
    if (!email) {
      setSubmissionMessage("No email available for this user.");
      return;
    }
    copyToClipboard(email);
  };

  const handleCopyPhone = (phoneNumber?: string | null) => {
    if (!phoneNumber) {
      setSubmissionMessage("No phone number available for this user.");
      return;
    }
    copyToClipboard(phoneNumber);
  };

  const handleFutureAction = (action: string, user: AdminUser) => {
    setSubmissionMessage(`${action} for ${user.email} will be supported in the next admin release.`);
  };

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionMessage(null);
    setIsAdding(true);

    try {
      await registerUser(newUser);
      setSubmissionMessage("User created successfully.");
      setIsInviteOpen(false);
      setNewUser({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
        user_type: "patient",
      });
      fetchUsers();
    } catch (err) {
      if (err instanceof APIError) {
        setSubmissionMessage(extractErrors(err));
      } else if (err instanceof Error) {
        setSubmissionMessage(err.message);
      } else {
        setSubmissionMessage("Failed to create user.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const searchLower = search.toLowerCase();
    return users.filter((user) =>
      [user.first_name, user.last_name, user.email, user.phone_number, user.user_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchLower)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const roleVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "doctor":
        return "default";
      case "nurse":
        return "secondary";
      case "patient":
      default:
        return "outline";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Review registered users, filter by name or email, and onboard users manually.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <AlertDialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="default">Add / Onboard User</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add a new user</AlertDialogTitle>
                <AlertDialogDescription>
                  Create a new user directly from the admin dashboard. Fill in the details below and choose their role.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <form className="space-y-4" onSubmit={handleAddUser}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">First name</span>
                    <Input
                      value={newUser.first_name}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, first_name: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Last name</span>
                    <Input
                      value={newUser.last_name}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, last_name: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Email</span>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Phone number</span>
                    <Input
                      type="tel"
                      value={newUser.phone_number}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, phone_number: event.target.value }))}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Username</span>
                    <Input
                      value={newUser.username}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, username: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Role</span>
                    <Select value={newUser.user_type} onValueChange={(value) => setNewUser((prev) => ({ ...prev, user_type: value }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Password</span>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, password: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Confirm password</span>
                    <Input
                      type="password"
                      value={newUser.confirm_password}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, confirm_password: event.target.value }))}
                      required
                    />
                  </label>
                </div>

                {submissionMessage && (
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {submissionMessage}
                  </div>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" disabled={isAdding} variant="default">
                    {isAdding ? "Creating…" : "Create user"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <div>{error}</div>
          <div className="mt-3 flex gap-2">
            {error.toLowerCase().includes("unauthorized") && (
              <Button onClick={() => router.push("/login")}>Sign in</Button>
            )}
            <Button variant="outline" onClick={() => fetchUsers()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>User list</CardTitle>
          <Input
            placeholder="Search users by name, email, or role"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-md"
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                  User
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                  Phone
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                  Role
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                  Verified
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                  Joined
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {user.profile_pic ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getMediaUrl(user.profile_pic) ?? ""}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.user_type?.charAt(0).toUpperCase() + user.user_type?.slice(1)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {user.phone_number || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <Badge variant={roleVariant(user.user_type)}>
                        {user.user_type?.charAt(0).toUpperCase() + user.user_type?.slice(1)}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {user.is_verified ? "Yes" : "No"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleCopyEmail(user.email)}>
                            Copy email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyPhone(user.phone_number)}>
                            Copy phone
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFutureAction("View profile", user)}>
                            View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFutureAction("Reset password", user)}>
                            Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFutureAction("Deactivate user", user)}>
                            Deactivate user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-700">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Future onboarding feature</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-gray-600">
            Soon, you’ll be able to manually onboard users who are not yet signed in and share them a platform invite link directly from this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
