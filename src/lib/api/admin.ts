/** @format */

import { get, put, del } from "./api";

// Doctor verification interfaces
export interface DoctorForVerification {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  specialization: string;
  years_of_experience: number;
  registration_number: string;
  biography: string;
  admin_verification_status: "pending" | "verified" | "rejected";
  admin_verified_at: string | null;
  admin_verification_notes: string;
  is_profile_complete: boolean;
  practicing_licenses: Array<{
    license_number: string;
    issuing_authority: string;
    issue_date: string;
    expiry_date: string;
    is_active: boolean;
  }>;
  created_at: string;
}

export interface VerificationDecision {
  admin_verification_status: "verified" | "rejected";
  admin_verification_notes?: string;
}

// Admin doctor management endpoints
export const getPendingDoctors = (status?: "pending" | "verified" | "rejected") => {
  const url = status
    ? `/auth/admin/pending-doctors/?status=${status}`
    : `/auth/admin/pending-doctors/`;
  return get<DoctorForVerification[]>(url);
};

export const getDoctorForVerification = (doctorId: number) => {
  return get<DoctorForVerification>(`/auth/admin/verify-doctor/${doctorId}/`);
};

export const verifyDoctor = (
  doctorId: number,
  decision: VerificationDecision
) => {
  return put<{ message: string; doctor: DoctorForVerification }>(
    `/auth/admin/verify-doctor/${doctorId}/`,
    decision
  );
};

// Admin dashboard statistics interface
export interface AdminStats {
  total_users: number;
  total_patients: number;
  total_doctors: number;
  total_nurses: number;
  pending_doctor_verifications: number;
  verified_doctors: number;
}

// Admin user management interfaces
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: "patient" | "doctor" | "nurse" | "admin";
  phone_number: string;
  profile_pic: string | null;
  is_verified: boolean;
  created_at: string;
  profile?: any;
}

// Get admin dashboard statistics
export const getAdminStats = () => {
  return get<AdminStats>(`/auth/admin/stats/`);
};

// Get list of all users with filters
export const getAdminUsers = (userType?: string, search?: string) => {
  let url = `/auth/admin/users/`;
  const params = new URLSearchParams();
  
  if (userType) params.append("type", userType);
  if (search) params.append("search", search);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  return get<AdminUser[]>(url);
};

// Get detailed information about a specific user
export const getAdminUserDetail = (userId: number) => {
  return get<AdminUser>(`/auth/admin/users/${userId}/`);
};

export interface AdminContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter_subscription: boolean;
  ip_address: string | null;
  created_at: string;
  is_read: boolean;
}

export const getAdminContactMessages = (
  status?: "read" | "unread",
  search?: string
) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return get<AdminContactMessage[]>(`/contact/admin/messages/${suffix}`);
};

export const getAdminContactMessage = (messageId: number) => {
  return get<AdminContactMessage>(`/contact/admin/messages/${messageId}/`);
};

export const deleteAdminContactMessage = (messageId: number) => {
  return del(`/contact/admin/messages/${messageId}/`);
};