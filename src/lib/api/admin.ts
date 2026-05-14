/** @format */

import { get, put } from "./api";

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
