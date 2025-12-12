import {get, patch} from "./api"

export interface PatientProfile {
    patient: { id: number; first_name: string; last_name: string; phone_number: string; }
    emergency_contact: string;
    blood_type: string;
    allergies: string;
    chronic_conditions: string | "";
    // date_of_birth: Date;
    // profile_pic: string;
}

export interface DoctorProfile {
    patient: { id: number; first_name: string; last_name: string; phone_number: string; }
    license_number: string;
    specialization: string;
    years_of_experience: string;
    biography: string | ""
    // consultation_fee: number;
    is_available: boolean;
}

export const getPatientProfile = () => {
    return get<PatientProfile[]>("/auth/profile/");
}

export const getDoctorProfile = () => {
    return get<DoctorProfile[]>("/auth/profile/");
}

export const updatePatientProfile = () => {
    return patch<PatientProfile[]>("/auth/profile/update")
}

export const updateDoctorProfile = () => {
    return patch<DoctorProfile[]>("/auth/profile/update")
}