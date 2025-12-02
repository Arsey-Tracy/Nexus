/** @format */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sliders } from "lucide-react";

const SettingsPage = () => {
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
        <Sliders className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Settings &amp; Preferences</h1>
          <p className="text-gray-600">
            Customize your account and notification settings
          </p>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
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
                    Get notified of new messages from doctors
                  </p>
                </div>
                <Switch
                  checked={notifications.messages}
                  onCheckedChange={() => handleToggle("messages")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">Reset</Button>
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
