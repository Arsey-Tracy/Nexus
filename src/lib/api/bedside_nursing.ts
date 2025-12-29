/** @format */

import { get, post, patch } from "./api"; // Assuming you have a base api utility

export interface BedsideNursing {
  id: number;
  patient: { id: number; first_name: string; last_name: string; phone_number: string };
  doctor: { id: number; first_name: string; last_name: string } | null;
  address: string;
  symptoms: string;
  notes?: string;
  payment_amount?: string;
  phone_number?: string;
  requested_at: string;
  scheduled_time?: string;
  completed_at?: string;
  status: "pending" | "approved" | "assigned" | "completed" | "cancelled";
}

// This interface defines the response from requestBedsideNursing
export interface BedsideNursingRequestResponse {
  bedside_nursing?: BedsideNursing;
  payment_link?: string;
  patient?: BedsideNursing['patient'];
  doctor?: BedsideNursing['doctor'];
  symptoms?: string;
  address?: string;
  notes?: string;
  status?: string;
  [key: string]: unknown;
}

// For Patients: Request a new Bedside Nursing
export const requestBedsideNursing = (symptoms: string, address: string, notes?: string) => {
  return post<BedsideNursingRequestResponse>("/consultation/bedside-nursing/request/", {
    symptoms, address, notes, payment_status: "pending", // default status to pending
  });
};

export const getMyBedsideNursing = () => {
  return get<BedsideNursing[]>("/consultation/bedside-nursing/my-requests/");
};

// For Admins: Get pending bedside nursing requests
export const getPendingBedsideNursing = () => {
  return get<BedsideNursing[]>("/consultation/bedside-nursing/pending/");
};

// For Admins: Assign a doctor to a bedside nursing request
export const assignDoctorToBedsideNursing = (
  bedsideNursingId: number,
  doctorId: number
) => {
  return patch<BedsideNursing>(`/nursing/bedside/${bedsideNursingId}/assign/`, {
    doctor_id: doctorId,
  });
};