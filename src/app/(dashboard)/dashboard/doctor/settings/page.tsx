/** @format */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  // Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sliders, Briefcase } from "lucide-react";

const DoctorSettingsPage = () => {
  type NotificationSettings = {
    email: boolean;
    sms: boolean;
    appointments: boolean;
    messages: boolean;
  };

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: true,
    appointments: true,
    messages: true,
  });

  // const [specialization, setSpecialization] = useState("general-practice");
  const [consultationHours, setConsultationHours] = useState("08:00");
  const [maxPatientsPerDay, setMaxPatientsPerDay] = useState("10");

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
          <h1 className="text-3xl font-bold">Settings &amp; Preferences</h1>
          <p className="text-gray-600">
            Manage your professional settings and notification preferences
          </p>
        </div>
      </div>

      {/* Professional Settings */}
      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-sky-600" />
              <span>Professional Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Specialization
                </label>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general-practice">
                    General Practice
                  </SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Consultation Start Time
                </label>
                <Input
                  type="time"
                  value={consultationHours}
                  onChange={(e) => setConsultationHours(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Maximum Patients Per Day
                </label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={maxPatientsPerDay}
                  onChange={(e) => setMaxPatientsPerDay(e.target.value)}
                  className="w-full"
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Limit the number of consultation appointments per day
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline">Reset</Button>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-sky-600" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={() => handleToggle("email")}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">
                    SMS Notifications
                  </p>
                  <p className="text-sm text-gray-600">Receive text messages</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={() => handleToggle("sms")}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">
                    Appointment Reminders
                  </p>
                  <p className="text-sm text-gray-600">
                    Get reminded about upcoming appointments
                  </p>
                </div>
                <Switch
                  checked={notifications.appointments}
                  onCheckedChange={() => handleToggle("appointments")}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">
                    Message Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Get notified of new messages from patients
                  </p>
                </div>
                <Switch
                  checked={notifications.messages}
                  onCheckedChange={() => handleToggle("messages")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline">Reset</Button>
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DoctorSettingsPage;
