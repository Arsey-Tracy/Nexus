/** @format */

import { get, post, patch } from "./api"; // Assuming you have a base api utility

// Type definitions based on your Django models
export interface Consultation {
  id: number;
  patient: { id: number; first_name: string; last_name: string };
  doctor: { id: number; first_name: string; last_name: string } | null;
  symptoms: string;
  notes?: string;
  status: "pending" | "approved" | "assigned" | "completed" | "cancelled";
  requested_at: string;
  scheduled_time?: string;
  completed_at?: string;
  meeting_link?: string;
}

export interface Doctor {
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  specialization: string;
  // Add other fields as needed
}

// This interface defines the NEW response from requestConsultation
export interface ConsultationRequestResponse {
  consultation: Consultation;
  payment_link: string;
}
// For Patients: Request a new consultation
export const requestConsultation = (symptoms: string, notes?: string) => {
  // The function now returns a promise resolving to the new response type
  return post<ConsultationRequestResponse>("/consultation/consultations/request/", {
    symptoms,
    notes,
  });
};

// For Patients & Doctors: Get their list of consultations
export const getMyConsultations = () => {
  return get<Consultation[]>("/consultation/consultations/my-consultations/");
};

// For Patients: Leave a review for a completed consultation
export const createReview = (
  consultationId: number,
  rating: number,
  comment?: string
) => {
  return post(`/consultation/consultations/${consultationId}/review/`, { rating, comment });
};

// For Admins: Get pending consultations
export const getPendingConsultations = () => {
  return get<Consultation[]>("/consultation/consultations/pending/");
};

// For Admins: Get a list of available doctors
export const getAvailableDoctors = () => {
  // This reuses your existing endpoint for medical professionals
  return get<Doctor[]>("/auth/professionals/");
};

// For Admins: Assign a doctor to a consultation
export const assignDoctorToConsultation = (
  consultationId: number,
  doctorId: number
) => {
  return patch<Consultation>(`/consultation/consultations/${consultationId}/assign/`, {
    doctor_id: doctorId,
  });
};