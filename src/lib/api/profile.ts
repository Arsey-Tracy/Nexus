/** @format */
// import { headers } from "next/headers";
import { get, patch, post, put } from "./api";

// Account type based on Django AbstractUser
export interface Account {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth?: string;
  profile_pic?: string;
  user_type: "patient" | "doctor" | "nurse" | "admin";
  is_verified: boolean;
  created_at: string;
}

export interface PatientProfile {
  user: Account;
  emergency_contact?: string;
  blood_type?: string;
  allergies?: string;
  chronic_conditions?: string;
}

export interface DoctorProfile {
  user: Account;
  national_id?: string;
  registration_number?: string;
  specialization?: string;
  is_specialist: boolean;
  biography?: string;
  years_of_experience?: number;
  // consultation_fee?: string;
  is_verified_by_umdpc: boolean;
  verification_date?: string;
  is_available: boolean;
  last_automated_check?: string;
  doctor_practicing_licenses: PracticingLicense[];
}

export interface PracticingLicense{
  // id: number;
  doctor: DoctorProfile;
  umdpc_certificate: string;
  foreign_medical_qualification: string;
  license_number?: string;
  issuing_authority?: string;
  issue_date?: string;
  expiry_date?: string;
  is_active: boolean;
}

// Doctor profile verification status interface
export interface DoctorProfileStatus {
  is_complete: boolean;
  is_verified: boolean;
  can_receive_appointments: boolean;
  admin_verification_status: "pending" | "verified" | "rejected";
  missing_fields: string[];
  rejection_reason?: string;
}

// Get current user account info
export const getCurrentAccount = () => {
  return get<Account>("/auth/me/");
};

// Update current user account
export const updateAccount = (data: Partial<Account>) => {
  return patch<Account>("/auth/me/update/", data);
};

// Get patient profile (includes user data and patient-specific fields)
export const getPatientProfile = () => {
  return get<PatientProfile>("/auth/profile/");
};

export const createPracticingLicense = (formData: FormData) => {
  return post<PracticingLicense>("/auth/licenses/", formData, {
    headers: {"Content-Type": "multipart/form-data"}
  })
}
export const getMyPracticingLicense = (id: number) => {
  return get<PracticingLicense>(`/auth/licenses/${id}/`);
}
// Get doctor profile (includes user data and medical professional fields)
export const getDoctorProfile = () => {
  return get<DoctorProfile>("/auth/profile/");
};

// Update patient profile
export const updatePatientProfile = (formData: FormData) => {
  // Use PUT to match the backend UpdateProfileView
  // Do NOT set Content-Type header - browser will automatically set it with the proper boundary
  return put<PatientProfile>("/auth/profile/update/", formData);
};

//  Update doctor profile
// export const updateDoctorProfile = (data: Partial<DoctorProfile>) => {
//   return patch<DoctorProfile>("/auth/profile/update/", data);
// };

// Update doctor profile (General + Professional)
// export const updateDoctorProfile = (data: Partial<DoctorProfile> & Partial<Account>) => {
//   // Use PUT to match the backend UpdateProfileView
//   return put<DoctorProfile>("/auth/profile/update/", data);
// };

// Update doctor profile (General + Professional) with multipart/form-data support for profile picture and license uploads
export const updateDoctorProfile = (formData: FormData) => {
  // Use PUT to match the backend UpdateProfileView
  // Do NOT set Content-Type header - browser will automatically set it with proper boundary
  return put<DoctorProfile>("/auth/profile/update/", formData);
};

// Get doctor profile verification status
export const getDoctorProfileStatus = () => {
  return get<DoctorProfileStatus>("/auth/doctor/profile-status/");
};