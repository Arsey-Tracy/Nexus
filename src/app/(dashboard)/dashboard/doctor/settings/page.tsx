/** @format */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sliders, Briefcase } from "lucide-react";
import {
  getDoctorProfile,
  updateDoctorProfile,
  DoctorProfile,
  Account,
} from "@/lib/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";

const specializations = [
  { value: "general-practice", label: "General Practice" },
  { value: "cardiology", label: "Cardiology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "neurology", label: "Neurology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "orthopedics", label: "Orthopedics" },
];

const DoctorSettingsPage = () => {
  const [specialization, setSpecialization] = useState("general-practice");
  const [biography, setBiography] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [notifications] = useState({
    email: true,
    sms: false,
    appointments: true,
    messages: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDoctorProfile();
        const profile = response as DoctorProfile;
        const user = profile.user as Account;

        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");
        setEmail(user.email || "");
        setPhoneNumber(user.phone_number || "");
        setSpecialization(profile.specialization || "general-practice");
        setBiography(profile.biography || "");
        setYearsOfExperience(String(profile.years_of_experience || ""));
        setIsAvailable(Boolean(profile.is_available));
      } catch (err) {
        console.error(err);
        setError("Unable to load doctor settings. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone_number", phoneNumber);
      formData.append("specialization", specialization);
      formData.append("biography", biography);
      formData.append("years_of_experience", yearsOfExperience);
      formData.append("is_available", isAvailable ? "true" : "false");

      await updateDoctorProfile(formData);
      setSuccessMessage("Your doctor settings have been updated.");
      window.setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Briefcase className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Doctor Settings</h1>
          <p className="text-gray-600">
            Manage your professional profile and review notifications.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-sky-600" />
              <span>Professional Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Specialization
                </label>
                <Select
                  value={specialization}
                  onValueChange={setSpecialization}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Biography
                </label>
                <Textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="w-full"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="w-full"
                  min="0"
                  placeholder="e.g. 5"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <div>
                  <p className="font-semibold text-gray-900">Available for Appointments</p>
                  <p className="text-sm text-gray-600">
                    Toggle your availability so patients can book with you.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" disabled={saving || loading}>
                Reset
              </Button>
              <Button onClick={handleSaveSettings} disabled={saving || loading}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-sky-600" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 mb-4">
              <p className="text-sm text-gray-700">
                Notification preference settings are under development. These controls will be connected to backend notification policy soon.
              </p>
            </div>
            <div className="grid gap-4">
              {(
                [
                  {
                    title: "Email Notifications",
                    description: "Receive updates via email",
                    value: notifications.email,
                  },
                  {
                    title: "SMS Notifications",
                    description: "Receive text messages",
                    value: notifications.sms,
                  },
                  {
                    title: "Appointment Reminders",
                    description: "Get reminded about upcoming appointments",
                    value: notifications.appointments,
                  },
                  {
                    title: "Message Notifications",
                    description: "Get notified of new messages from patients",
                    value: notifications.messages,
                  },
                ] as const
              ).map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <Switch checked={item.value} disabled />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" disabled>
                Reset
              </Button>
              <Button disabled>Coming Soon</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DoctorSettingsPage;
