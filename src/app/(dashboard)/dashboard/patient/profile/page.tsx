/** @format */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Loader2, AlertCircle, Camera } from "lucide-react";
import {
  getPatientProfile,
  updatePatientProfile,
  Account,
  PatientProfile,
} from "@/lib/api/profile";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMediaUrl } from "@/lib/utils";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for user account info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  // const [profilePicture, setProfilePicture] = useState("");

  // Additional patient info
  const [emergencyContact, setEmergencyContact] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");

  // Store original values for cancel functionality
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedProfilePicUrl, setSavedProfilePicUrl] = useState<string | null>(
    null,
  );
  const [originalProfilePicUrl, setOriginalProfilePicUrl] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalData, setOriginalData] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    emergencyContact?: string;
    bloodType?: string;
    allergies?: string;
    chronicConditions?: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPatientProfile();

        if (response) {
          const patientData = response as PatientProfile;
          const userData = patientData.user as Account;

          // Set user account fields
          // setProfilePicture(userData.profile_pic || "");
          setFirstName(userData.first_name || "");
          setLastName(userData.last_name || "");
          setEmail(userData.email || "");
          setPhone(userData.phone_number || "");
          setDateOfBirth(userData.date_of_birth || "");
          setSavedProfilePicUrl(getMediaUrl(userData.profile_pic) || null);
          setOriginalProfilePicUrl(getMediaUrl(userData.profile_pic) || null);

          // Set patient-specific fields
          setEmergencyContact(patientData.emergency_contact || "");
          setBloodType(patientData.blood_type || "");
          setAllergies(patientData.allergies || "");
          setChronicConditions(patientData.chronic_conditions || "");

          // Store original for cancel functionality
          setOriginalData({
            firstName: userData.first_name || "",
            lastName: userData.last_name || "",
            email: userData.email || "",
            phone: userData.phone_number || "",
            dateOfBirth: userData.date_of_birth || "",
            emergencyContact: patientData.emergency_contact || "",
            bloodType: patientData.blood_type || "",
            allergies: patientData.allergies || "",
            chronicConditions: patientData.chronic_conditions || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const { updateUser } = useAuth();

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone_number", phone);
      formData.append("date_of_birth", dateOfBirth);
      formData.append("emergency_contact", emergencyContact);
      formData.append("blood_type", bloodType);
      formData.append("allergies", allergies);
      formData.append("chronic_conditions", chronicConditions);

      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      }

      const updated = (await updatePatientProfile(formData)) as PatientProfile;

      const updatedUser = updated.user as Account;
      updateUser(updatedUser as any);

      setSavedProfilePicUrl(getMediaUrl(updatedUser.profile_pic) || null);
      setPreviewUrl(null);
      setSelectedFile(null);

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setOriginalProfilePicUrl(getMediaUrl(updatedUser.profile_pic) || null);
      setOriginalData({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        emergencyContact,
        bloodType,
        allergies,
        chronicConditions,
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFirstName(originalData.firstName ?? "");
      setLastName(originalData.lastName ?? "");
      setEmail(originalData.email ?? "");
      setPhone(originalData.phone ?? "");
      setDateOfBirth(originalData.dateOfBirth ?? "");
      setEmergencyContact(originalData.emergencyContact ?? "");
      setBloodType(originalData.bloodType ?? "");
      setAllergies(originalData.allergies ?? "");
      setChronicConditions(originalData.chronicConditions ?? "");
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setSavedProfilePicUrl(originalProfilePicUrl ?? null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto p-8 space-y-6"
      >
        <div className="flex items-center justify-center min-h-100">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center text-2xl font-semibold text-sky-700">
              {previewUrl || savedProfilePicUrl ? (
                <img
                  src={previewUrl || savedProfilePicUrl || undefined}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>
                  {`${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
                    "U"}
                </span>
              )}
            </div>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Upload profile picture"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setSelectedFile(file);
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 right-0 inline-flex items-center justify-center rounded-full bg-white border border-slate-200 p-2 shadow-sm text-slate-500 hover:bg-slate-50"
                  aria-label="Upload profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Personal Information</span>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                disabled={saving}
              >
                {isEditing ? "Cancel Edit" : "Edit"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  type="email"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <Input
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!isEditing}
                  type="date"
                  className="mt-1"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Emergency Contact
                </label>
                <Input
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="Not provided"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <Input
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="Not provided"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <Input
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="Not provided"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Chronic Conditions
                </label>
                <Input
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="Not provided"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
