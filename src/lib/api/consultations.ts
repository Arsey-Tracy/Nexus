/** @format */

import { get, post, patch } from "./api"; // Assuming you have a base api utility

// Type definitions based on your Django models
export interface Consultation {
  id: number;
  patient: { id: number; first_name: string; last_name: string; phone_number: string };
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

// This interface defines the response from requestConsultation
// The backend returns either just the consultation, or consultation + payment_link
export interface ConsultationRequestResponse {
  consultation?: Consultation;
  payment_link?: string;
  id?: number;
  // patient?: any;
  // doctor?: any;
  patient?: Consultation['patient'];
  doctor?: Consultation['doctor'];
  symptoms?: string;
  notes?: string;
  status?: string;
  // [key: string]: any;
  [key: string]: unknown;
}

// For Patients: Request a new consultation
export const requestConsultation = (symptoms: string, notes?: string, consultationType?: "virtual" | "bedside") => {
  // The function returns the consultation response from the backend
  // Can be either a Consultation object directly or a ConsultationRequestResponse with payment_link
  // Include payment_status as required by Django backend
  return post<ConsultationRequestResponse>("/consultation/consultations/request/", {
    symptoms,
    notes,
    consultation_type: consultationType || "virtual",
    payment_status: "pending", // Default payment status
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