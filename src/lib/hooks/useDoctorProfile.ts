import {useState, useEffect, useCallback} from 'react';
import {getDoctorProfile, updateDoctorProfile, Account, DoctorProfile, PracticingLicense} from '../api/profile';
import { getMediaUrl } from '../utils';
import { useAuth } from '../auth/AuthContext';

export interface DoctorProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  specialization: string;
  biography: string;
  date_of_birth: string;
  years_of_experience: number | null;
  national_id_url: string | null;
  saved_profile_pic_url: string | null;
  registration_number: string;
  practicing_license: PracticingLicense[]; // Optional file input for practicing license
  is_available: boolean;
}

const defaultFormData: DoctorProfileFormData = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    specialization: '',
    biography: '',
    years_of_experience: null,
    national_id_url: null,
    saved_profile_pic_url: null,
    registration_number: '',
    practicing_license: [],
    is_available: false,
    date_of_birth: ''
}

export const useDoctorProfile = () => {
    const {updateUser} = useAuth();

    // Meta states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // consolidated data states
    const [formData, setFormData] = useState<DoctorProfileFormData>(defaultFormData);
    const [originalData, setOriginalData] = useState<DoctorProfileFormData>(defaultFormData);

    // File Upload States
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
    // const [licenseFile, setLicenseFile] = useState<File | null>(null);

    useEffect(() => {
        return () => {
            // Clean up preview URL on unmount
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [previewUrl]);
    const fetchDoctorProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDoctorProfile();

            if (response) {
                const doctorData = response as DoctorProfile;
                const userData = doctorData.user as Account;

                // Map backend to our flat frontend state
                const mappedData: DoctorProfileFormData = {
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    phone_number: userData.phone_number || '',
                    specialization: doctorData.specialization || '',
                    date_of_birth: userData.date_of_birth || '',
                    biography: doctorData.biography || '',
                    years_of_experience: doctorData.years_of_experience || null,
                    national_id_url: getMediaUrl(doctorData.national_id) || null,
                    saved_profile_pic_url: getMediaUrl((userData as any).profile_pic) || null,
                    registration_number: doctorData.registration_number || '',
                    practicing_license: doctorData.doctor_practicing_licenses || [],
                    is_available: doctorData.is_available || false
                };

                setFormData(mappedData);
                setOriginalData(mappedData);
            }
        } catch (err) {
            setError('Failed to fetch doctor profile.');
            console.error(err)
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(()=>{
        fetchDoctorProfile();
    }, [fetchDoctorProfile]);  

    // Generic input handler for text/number/boolean fields (allow null for optional fields)
    const handleInputChange = (
        field: keyof DoctorProfileFormData,
        value: string | number | boolean | null
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleProfilePicChange = (file: File | null) => {
        setProfilePicFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleNationalIdChange = (file: File | null) => {
        setNationalIdFile(file);
        // Show a local preview URL if a file was selected, otherwise clear
        const url = file ? URL.createObjectURL(file) : null;
        handleInputChange("national_id_url", url);
        if (!file && previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);
            
            // Build multipart form data for file uploads
            const submitData = new FormData();
            if (profilePicFile) submitData.append('profile_pic', profilePicFile);
            if (nationalIdFile) submitData.append('national_id', nationalIdFile);
            // if (licenseFile) submitData.append('practicing_license', licenseFile);{}
            submitData.append("first_name", formData.first_name);
            submitData.append("last_name", formData.last_name);
            submitData.append("email", formData.email);
            submitData.append("phone_number", formData.phone_number);
            submitData.append("date_of_birth", formData.date_of_birth);
            submitData.append("registration_number", formData.registration_number);
            submitData.append("specialization", formData.specialization);
            submitData.append("biography", formData.biography);
            submitData.append("years_of_experience", String(formData.years_of_experience));
            submitData.append("is_available", String(formData.is_available));

            const updated = await updateDoctorProfile(submitData);
            const updatedUser = updated.user as Account;

            // Update global auth context
            updateUser(updatedUser as never);

            // Sync state with newly returned data
            const mappedData = {
                ...formData,
                saved_profile_pic_url: getMediaUrl((updatedUser as any).profile_pic) || formData.saved_profile_pic_url,
                national_id_url: getMediaUrl(updated.national_id) || null,
                // practicing_license: updated.doctor_practicing_licenses || formData.practicing_license
            };
            setFormData(mappedData);
            setOriginalData(mappedData);

            // rest files
            setPreviewUrl(null);
            setProfilePicFile(null);
            setNationalIdFile(null);
            // setLicenseFile(null);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
            return true;
            } catch (err) {
                setError('Failed to update doctor profile.');
                console.error('Failed to save profile:', err);
                return false;
            } finally {
                setSaving(false);
            }
        };
    const handleCancel = () => {
        setFormData(originalData);

        // Discrd pending file previews
        if (previewUrl){
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setProfilePicFile(null);
    }
    const handleLicenseUploaded = async () => {
        await fetchDoctorProfile(); // Refresh the list from backend
        setSuccessMessage("License uploaded successfully.");
        setTimeout(()=> setSuccessMessage(null), 4000);
    };
    return {
        formData,
        loading,
        saving,
        error,
        successMessage,
        previewUrl,
        nationalIdFile,
        handleInputChange,
        handleProfilePicChange,
        handleNationalIdChange,
        handleSave,
        handleCancel,
        handleLicenseUploaded,
    };
};