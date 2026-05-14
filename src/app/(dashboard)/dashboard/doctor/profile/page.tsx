/** @format */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Loader2,
  AlertCircle,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  DollarSign,
  CheckCircle2,
  XCircle,
  Camera,
} from "lucide-react";
import {
  getDoctorProfile,
  Account,
  DoctorProfile,
  PracticingLicense,
  updateDoctorProfile,
} from "@/lib/api/profile";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LicenseUploadForm from "@/components/LicenseUploadForm";
import { getMediaUrl } from "@/lib/utils";
type OriginalProfileData = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  nationalId?: string | null;
  registrationNumber?: string | null;
  specialization?: string | null;
  yearsOfExperience?: string | number | null;
  biography?: string | null;
  isAvailable?: boolean;
  lastAutomatedCheck?: string | null;
};

type AccountWithProfilePic = Account & {
  profile_pic?: string | null;
};

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

  // Professional info (read-only)
  // Inside your ProfilePage component, add these states:
  const [specialization, setSpecialization] = useState<string | null>(null);
  const [biography, setBiography] = useState<string | null>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState<number | null>(
    null,
  );
  const [nationalId, setNationalId] = useState<string | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [consultationFee, setConsultationFee] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [lastAutomatedCheck, setLastAutomatedCheck] = useState("");

  const [nationalIdUrl, setNationalIdUrl] = useState<string | null>(null);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [practicingLicenses, setPracticingLicenses] = useState<
    PracticingLicense[]
  >([]);

  // Profile image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // The URL of the currently saved profile picture from the server
  const [savedProfilePicUrl, setSavedProfilePicUrl] = useState<string | null>(
    null,
  );

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store original values for cancel functionality
  const [originalData, setOriginalData] = useState<OriginalProfileData | null>(
    null,
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDoctorProfile();

        if (response) {
          const doctorData = response as DoctorProfile;
          const userData = doctorData.user as Account;

          setFirstName(userData.first_name || "");
          setLastName(userData.last_name || "");
          setEmail(userData.email || "");
          setPhone(userData.phone_number || "");
          setDateOfBirth(userData.date_of_birth || "");

          setRegistrationNumber(doctorData.registration_number || "");
          setNationalId(doctorData.national_id || null);
          setNationalIdUrl(getMediaUrl(doctorData.national_id) || null);
          setSpecialization(doctorData.specialization || "");
          setBiography(doctorData.biography || "");
          setYearsOfExperience(doctorData.years_of_experience || 0);
          setLastAutomatedCheck(doctorData.last_automated_check || "");
          setIsAvailable(doctorData.is_available || false);
          setPracticingLicenses(doctorData.doctor_practicing_licenses || []);

          // FIX: Save the profile picture URL from the server if it exists
          // Convert relative media path to full URL
          setSavedProfilePicUrl(
            getMediaUrl((userData as AccountWithProfilePic).profile_pic) ||
              null,
          );

          setOriginalData({
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            phone: userData.phone_number,
            dateOfBirth: userData.date_of_birth,
            nationalId: doctorData.national_id,
            registrationNumber: doctorData.registration_number,
            specialization: doctorData.specialization,
            yearsOfExperience: doctorData.years_of_experience,
            biography: doctorData.biography,
            isAvailable: doctorData.is_available,
            lastAutomatedCheck: doctorData.last_automated_check,
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

  // FIX: Clean up the object URL to avoid memory leaks when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // FIX: Proper file change handler — creates a local preview URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Revoke previous preview URL before creating a new one
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNationalIdFile(file);
      setNationalIdUrl(null);
    }
  };

  const { updateUser } = useAuth();

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const formData = new FormData();

      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      }

      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone_number", phone);
      formData.append("date_of_birth", dateOfBirth);

      formData.append("registration_number", registrationNumber);
      formData.append("specialization", specialization ?? "");
      formData.append("biography", biography ?? "");
      formData.append("years_of_experience", String(yearsOfExperience || ""));
      formData.append("is_available", String(isAvailable));

      if (nationalIdFile) {
        formData.append("national_id", nationalIdFile);
      }

      const updated = await updateDoctorProfile(formData);
      const updatedUser = updated.user as Account;
      setSavedProfilePicUrl(getMediaUrl(updatedUser.profile_pic) || null);
      setNationalId(updated.national_id || null);
      setNationalIdUrl(getMediaUrl(updated.national_id) || null);

      updateUser(updatedUser as any);

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      setNationalIdFile(null);

      setOriginalData({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        nationalId: updated.national_id || null,
        registrationNumber,
        specialization,
        yearsOfExperience,
        biography,
        isAvailable,
        lastAutomatedCheck,
      });

      setOriginalData({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        nationalId,
        lastAutomatedCheck,
        specialization,
        yearsOfExperience,
        biography,
        isAvailable,
      });

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
      setFirstName(originalData.firstName || "");
      setLastName(originalData.lastName || "");
      setEmail(originalData.email || "");
      setPhone(originalData.phone || "");
      setDateOfBirth(originalData.dateOfBirth || "");
      setRegistrationNumber(originalData.registrationNumber || "");
      setSpecialization(originalData.specialization ?? "");
      setYearsOfExperience(
        typeof originalData.yearsOfExperience === "string"
          ? Number(originalData.yearsOfExperience) || null
          : ((originalData.yearsOfExperience as number | null) ?? null),
      );
      setBiography(originalData.biography ?? "");
      setIsAvailable(originalData.isAvailable || false);
      setNationalId(originalData.nationalId || null);
      setNationalIdUrl(getMediaUrl(originalData.nationalId) || null);
    }

    // FIX: Discard the pending preview when cancelling
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setNationalIdFile(null);
    setIsEditing(false);
    setError(null);
  };

  // Determine which image to show in the avatar:
  // 1. A newly selected (not yet saved) preview
  // 2. The saved profile picture from the server
  // 3. Fallback to the initials / icon
  const displayImageUrl = previewUrl || savedProfilePicUrl;

  const getInitials = () => {
    const f = firstName?.[0] || "";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase() || "DR";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
              <p className="text-gray-600 font-medium">
                Loading your profile...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {firstName && lastName
                    ? `Dr. ${firstName} ${lastName}`
                    : "My Profile"}
                </h1>
                <p className="text-gray-600">
                  Manage your professional information and account settings
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/30"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-sky-500 to-blue-600" />
              <CardContent className="pt-0 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  {/* FIX: Avatar with clickable upload overlay when editing */}
                  <div className="relative h-24 w-24">
                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                      {displayImageUrl ? (
                        // FIX: Show the actual image when one exists
                        <img
                          src={displayImageUrl}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        // Fallback: initials or icon
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {getInitials()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* FIX: Camera overlay button — only visible while editing */}
                    {isEditing && (
                      <>
                        {/* Hidden real file input */}
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          title="Change profile photo"
                        >
                          <Camera className="h-6 w-6 text-white" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* FIX: Show helper text + file name when a new image is staged */}
                  {isEditing && (
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      {selectedFile
                        ? `Selected: ${selectedFile.name}`
                        : "Click photo to change"}
                    </p>
                  )}

                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {firstName && lastName
                      ? `Dr. ${firstName} ${lastName}`
                      : "Doctor"}
                  </h3>
                  {specialization && (
                    <p className="text-sm text-gray-600 mt-1">
                      {specialization}
                    </p>
                  )}
                  <div className="mt-3">
                    <Badge
                      variant={isAvailable ? "default" : "secondary"}
                      className={
                        isAvailable
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-gray-400"
                      }
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Available
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  {email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-gray-900 truncate">{email}</p>
                      </div>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-gray-900">{phone}</p>
                      </div>
                    </div>
                  )}

                  {dateOfBirth && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="text-gray-900">
                          {new Date(dateOfBirth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 mr-2 text-sky-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      First Name
                      {isEditing && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className={`transition-all ${isEditing ? "border-sky-200 focus:border-sky-500 focus:ring-sky-500" : "bg-gray-50"}`}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      Last Name
                      {isEditing && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className={`transition-all ${isEditing ? "border-sky-200 focus:border-sky-500 focus:ring-sky-500" : "bg-gray-50"}`}
                      placeholder="Enter last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Email Address
                      {isEditing && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      type="email"
                      className={`transition-all ${isEditing ? "border-sky-200 focus:border-sky-500 focus:ring-sky-500" : "bg-gray-50"}`}
                      placeholder="doctor@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Phone Number
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className={`transition-all ${isEditing ? "border-sky-200 focus:border-sky-500 focus:ring-sky-500" : "bg-gray-50"}`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Date of Birth
                    </label>
                    <Input
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={!isEditing}
                      type="date"
                      className={`transition-all ${isEditing ? "border-sky-200 focus:border-sky-500 focus:ring-sky-500" : "bg-gray-50"}`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-end gap-3 mt-6 pt-6 border-t"
                    >
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/30"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Professional Information Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="h-5 w-5 mr-2 text-sky-600" />
                    Professional Information
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {isEditing ? "Editable" : "Review Details"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Briefcase className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Registration Number
                    </label>
                    <Input
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter registration number"
                      className={
                        !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Briefcase className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Specialization
                    </label>
                    <Input
                      value={specialization || ""}
                      onChange={(e) => setSpecialization(e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g. Family Medicine"
                      className={
                        !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Years of Experience
                    </label>
                    <Input
                      value={yearsOfExperience ?? ""}
                      onChange={(e) =>
                        setYearsOfExperience(Number(e.target.value))
                      }
                      disabled={!isEditing}
                      type="number"
                      min={0}
                      placeholder="0"
                      className={
                        !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Availability
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        value={isAvailable ? "Available" : "Not Available"}
                        disabled
                        className="bg-gray-50 text-gray-600"
                      />
                      <Button
                        type="button"
                        variant={isAvailable ? "secondary" : "outline"}
                        onClick={() =>
                          isEditing && setIsAvailable(!isAvailable)
                        }
                        disabled={!isEditing}
                      >
                        {isAvailable ? "Toggle Off" : "Toggle On"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      National ID Document
                    </label>
                    <div className="grid gap-3">
                      {nationalIdUrl && !nationalIdFile ? (
                        <a
                          href={nationalIdUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-700 hover:text-sky-900 underline"
                        >
                          View current national ID document
                        </a>
                      ) : null}
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleNationalIdChange}
                        disabled={!isEditing}
                      />
                      {nationalIdFile && (
                        <p className="text-sm text-gray-500">
                          Selected: {nationalIdFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Biography
                    </label>
                    <Textarea
                      value={biography || ""}
                      onChange={(e) => setBiography(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell patients about your training, approach, and experience."
                      className={
                        !isEditing
                          ? "bg-gray-50 text-gray-600 min-h-[120px] resize-none"
                          : "bg-white"
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Updating your registration number, specialization, years
                      of experience, or national ID will require a new admin
                      review. Your profile may move back to pending verification
                      until the changes are approved.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-sky-600" />
                  Practicing Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {practicingLicenses.length > 0 ? (
                  <div className="space-y-3">
                    {practicingLicenses.map((license, index) => (
                      <div
                        key={`${license.license_number}-${index}`}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <p className="font-semibold text-gray-900">
                          {license.license_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {license.issuing_authority} • {license.issue_date} to{" "}
                          {license.expiry_date}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {license.is_active ? "Active" : "Inactive"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No practicing licenses added yet. Add one below to complete
                    your verification profile.
                  </p>
                )}

                <LicenseUploadForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
