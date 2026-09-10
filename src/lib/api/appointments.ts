import { get, post } from "./api";

export interface AppointmentData {
  patient_id: number;
  professional_id: number;
  appointment_type: string;
  schedule_time: string;
  duration: number;
  reason: string;
  symptoms: string;
}

export interface Appointment {
  id: number;
  patient_name: string;
  professional_name: string;
  appointment_type: string;
  schedule_time: string;
  duration: number;
  status: string;
  reason: string;
  symptoms: string;
  created_at: string;
}

export interface AppointmentActionResponse {
  message: string;
  appointment: Appointment;
}

// Create a new appointment
export const createAppointment = (data: AppointmentData) => {
  return post<Appointment>(`/appointments/`, {
    patient: data.patient_id,
    professional: data.professional_id,
    appointment_type: data.appointment_type,
    schedule_time: data.schedule_time,
    duration: data.duration,
    reason: data.reason,
    symptoms: data.symptoms,
    status: "scheduled",
  });
};

// Get user's appointments
export const getUserAppointments = () => {
  return post<Appointment[]>(`/appointments/upcoming/`, {});
};

// Get today's appointments
export const getTodayAppointments = () => {
  return post<Appointment[]>(`/appointments/today/`, {});
};

// Get appointment details
export const getAppointmentDetail = (appointmentId: number) => {
  return get<Appointment>(`/appointments/${appointmentId}/`);
};

// Cancel appointment
export const cancelAppointment = (appointmentId: number) => {
  return post<AppointmentActionResponse>(`/appointments/${appointmentId}/cancel/`, {});
};

// Complete appointment
export const completeAppointment = (appointmentId: number) => {
  return post<AppointmentActionResponse>(`/appointments/${appointmentId}/complete/`, {});
};
