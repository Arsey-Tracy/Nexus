/** @format */
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [specialization, setSpecialization] = useState<string | null>(null);
  const [biography, setBiography] = useState<string | null>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState<number | null>(null);
  const [nationalId, setNationalId] = useState<string | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [lastAutomatedCheck, setLastAutomatedCheck] = useState("");

  const [nationalIdUrl, setNationalIdUrl] = useState<string | null>(null);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [practicingLicenses, setPracticingLicenses] = useState<PracticingLicense[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedProfilePicUrl, setSavedProfilePicUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalData, setOriginalData] = useState<OriginalProfileData | null>(null);

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

        setSavedProfilePicUrl(
          getMediaUrl((userData as AccountWithProfilePic).profile_pic) || null,
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

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

      updateUser(updatedUser as never);

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

  const handleLicenseUploaded = async () => {
    await fetchProfile();
    setSuccessMessage("License uploaded successfully.");
    setError(null);
    window.setTimeout(() => setSuccessMessage(null), 4000);
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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setNationalIdFile(null);
    setIsEditing(false);
    setError(null);
  };

  const displayImageUrl = previewUrl || savedProfilePicUrl;

  const getInitials = () => {
    const f = firstName?.[0] || "";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase() || "DR";
  };

  // ─── Shared input class helpers ───────────────────────────────────────────
  const fieldBase =
    "h-10 rounded-lg border text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-0";
  const fieldActive = `${fieldBase} border-slate-200 bg-white focus:border-sky-400 placeholder:text-slate-400`;
  const fieldDisabled = `${fieldBase} border-transparent bg-slate-50 text-slate-700 cursor-default`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/60 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium tracking-wide">Loading your profile…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/60">
      {/* ── Top accent bar ─────────────────────────────────────────────────── */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-sky-600 mb-1">
              Doctor Portal
            </p>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {firstName && lastName ? `Dr. ${firstName} ${lastName}` : "My Profile"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your professional information and account settings
            </p>
          </div>

          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 rounded-xl h-10 px-5 text-sm font-semibold transition-all"
            >
              <Edit3 className="h-3.5 w-3.5 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* ── Alerts ───────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5"
            >
              <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5"
            >
              <Alert className="bg-emerald-50 border-emerald-200 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700 text-sm">{successMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Layout grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT: Profile summary card ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-[0_2px_24px_-4px_rgba(15,23,42,0.1)] bg-white rounded-2xl overflow-hidden sticky top-6">
              {/* Gradient hero strip */}
              <div className="relative h-28 bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-8"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))",
                  }}
                />
              </div>

              <CardContent className="pt-0 pb-7 px-6">
                {/* Avatar ─────────────────────────────────────────────────── */}
                <div className="flex flex-col items-center -mt-12 mb-5">
                  <div className="relative h-24 w-24 group">
                    <div className="h-24 w-24 rounded-full ring-4 ring-white shadow-xl">
                      {displayImageUrl ? (
                        <Image
                          width={96}
                          height={96}
                          src={displayImageUrl}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold tracking-tight">
                            {getInitials()}
                          </span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <>
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
                          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0 shadow-none"
                          title="Change profile photo"
                        >
                          <Camera className="h-5 w-5 text-white" />
                        </Button>
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <p className="mt-2 text-xs text-slate-400 text-center">
                      {selectedFile ? `Selected: ${selectedFile.name}` : "Hover photo to change"}
                    </p>
                  )}

                  <h3 className="mt-3 text-lg font-bold text-slate-900 tracking-tight">
                    {firstName && lastName ? `Dr. ${firstName} ${lastName}` : "Doctor"}
                  </h3>
                  {specialization && (
                    <p className="text-sm text-slate-500 mt-0.5">{specialization}</p>
                  )}

                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                      }`}
                    >
                      {isAvailable ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>

                <Separator className="my-5 bg-slate-100" />

                {/* Contact quick-view ──────────────────────────────────────── */}
                <div className="space-y-3.5">
                  {email && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                        <Mail className="h-3.5 w-3.5 text-sky-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-0.5">Email</p>
                        <p className="text-sm text-slate-800 truncate">{email}</p>
                      </div>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                        <Phone className="h-3.5 w-3.5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-0.5">Phone</p>
                        <p className="text-sm text-slate-800">{phone}</p>
                      </div>
                    </div>
                  )}

                  {dateOfBirth && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-0.5">Date of Birth</p>
                        <p className="text-sm text-slate-800">
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

          {/* ── RIGHT: Detail cards ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Personal Information ──────────────────────────────────────── */}
            <Card className="border-0 shadow-[0_2px_24px_-4px_rgba(15,23,42,0.1)] bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
                  <span className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-sky-600" />
                  </span>
                  Personal Information
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pt-5 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase flex items-center gap-1">
                      First Name
                      {isEditing && <span className="text-red-400 normal-case tracking-normal">*</span>}
                    </label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? fieldActive : fieldDisabled}
                      placeholder="First name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase flex items-center gap-1">
                      Last Name
                      {isEditing && <span className="text-red-400 normal-case tracking-normal">*</span>}
                    </label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? fieldActive : fieldDisabled}
                      placeholder="Last name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase flex items-center gap-1">
                      Email Address
                      {isEditing && <span className="text-red-400 normal-case tracking-normal">*</span>}
                    </label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      type="email"
                      className={isEditing ? fieldActive : fieldDisabled}
                      placeholder="doctor@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Phone Number
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? fieldActive : fieldDisabled}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Date of Birth
                    </label>
                    <Input
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={!isEditing}
                      type="date"
                      className={isEditing ? fieldActive : fieldDisabled}
                    />
                  </div>
                </div>

                {/* Save / Cancel row */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100"
                    >
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                        className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
                      >
                        <X className="h-3.5 w-3.5 mr-1.5" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md shadow-sky-600/20 transition-all"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            Saving…
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5 mr-1.5" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Professional Information ──────────────────────────────────── */}
            <Card className="border-0 shadow-[0_2px_24px_-4px_rgba(15,23,42,0.1)] bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
                    <span className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center">
                      <Briefcase className="h-3.5 w-3.5 text-sky-600" />
                    </span>
                    Professional Information
                  </CardTitle>
                  <span
                    className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                      isEditing
                        ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isEditing ? "Editing" : "View Only"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="px-6 pt-5 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* Registration Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Registration Number
                    </label>
                    <Input
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter registration number"
                      className={isEditing ? fieldActive : fieldDisabled}
                    />
                  </div>

                  {/* Specialization */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Specialization
                    </label>
                    <Input
                      value={specialization || ""}
                      onChange={(e) => setSpecialization(e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g. Family Medicine"
                      className={isEditing ? fieldActive : fieldDisabled}
                    />
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Years of Experience
                    </label>
                    <Input
                      value={yearsOfExperience ?? ""}
                      onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                      disabled={!isEditing}
                      type="number"
                      min={0}
                      placeholder="0"
                      className={isEditing ? fieldActive : fieldDisabled}
                    />
                  </div>

                  {/* Availability toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Availability
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={isAvailable ? "Available" : "Not Available"}
                        disabled
                        className={fieldDisabled}
                      />
                      <Button
                        type="button"
                        variant={isAvailable ? "secondary" : "outline"}
                        onClick={() => isEditing && setIsAvailable(!isAvailable)}
                        disabled={!isEditing}
                        className="h-10 px-3.5 rounded-lg shrink-0 text-xs font-semibold border-slate-200"
                      >
                        {isAvailable ? "Toggle Off" : "Toggle On"}
                      </Button>
                    </div>
                  </div>

                  {/* National ID */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      National ID Document
                    </label>
                    <div className="space-y-2">
                      {nationalIdUrl && !nationalIdFile ? (
                        <a
                          href={nationalIdUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 underline underline-offset-2"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View current national ID document
                        </a>
                      ) : null}
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleNationalIdChange}
                        disabled={!isEditing}
                        className={`${isEditing ? "border-slate-200 bg-white file:bg-sky-50 file:text-sky-700 file:border-0 file:rounded-md file:mr-3 file:px-3 file:py-1 file:text-xs file:font-semibold" : "bg-slate-50 border-transparent"} rounded-lg text-sm`}
                      />
                      {nationalIdFile && (
                        <p className="text-xs text-slate-500">
                          Selected: {nationalIdFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Biography
                    </label>
                    <Textarea
                      value={biography || ""}
                      onChange={(e) => setBiography(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell patients about your training, approach, and experience."
                      className={`rounded-lg text-sm transition-all duration-200 min-h-28 resize-none ${
                        isEditing
                          ? "border-slate-200 bg-white focus:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-0 placeholder:text-slate-400"
                          : "border-transparent bg-slate-50 text-slate-700 cursor-default"
                      }`}
                    />
                  </div>
                </div>

                {/* Verification notice */}
                <div className="mt-5 flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Updating your registration number, specialization, years of experience, or national ID will require a new admin review. Your profile may move back to pending verification until the changes are approved.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Practicing Licenses ───────────────────────────────────────── */}
            <Card className="border-0 shadow-[0_2px_24px_-4px_rgba(15,23,42,0.1)] bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
                  <span className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-sky-600" />
                  </span>
                  Practicing Licenses
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pt-5 pb-6 space-y-4">
                {practicingLicenses.length > 0 ? (
                  <div className="space-y-3">
                    {practicingLicenses.map((license, index) => (
                      <div
                        key={`${license.license_number}-${index}`}
                        className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="h-9 w-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="h-4 w-4 text-sky-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="font-semibold text-slate-900 text-sm">
                              {license.license_number}
                            </p>
                            <span
                              className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                                license.is_active
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {license.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {license.issuing_authority}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {license.issue_date} → {license.expiry_date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-xl border-2 border-dashed border-slate-200">
                    <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">No licenses added yet</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add one below to complete your verification profile.</p>
                  </div>
                )}

                <LicenseUploadForm onSuccess={handleLicenseUploaded} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;