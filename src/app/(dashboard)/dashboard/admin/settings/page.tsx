/** @format */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { getCurrentAccount, updateAccount } from "@/lib/api/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SettingsPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        setLoading(true);
        setError(null);
        const account = await getCurrentAccount();
        setFirstName(account.first_name || "");
        setLastName(account.last_name || "");
        setEmail(account.email || "");
        setPhoneNumber(account.phone_number || "");
      } catch (err) {
        console.error(err);
        setError("Unable to load admin settings. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    loadAccount();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      await updateAccount({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
      });
      setSuccessMessage("Admin account settings saved.");
      window.setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
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
        <Settings className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-gray-600">
            Update your account settings and review platform configuration status.
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
            <CardTitle>Account Settings</CardTitle>
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
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" disabled={saving || loading}>
                Reset
              </Button>
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Shared admin configuration and platform-wide settings are still under development. The current page allows only admin account updates.
            </p>
            <div className="mt-4">
              <Button variant="outline" disabled>
                Manage Platform Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
