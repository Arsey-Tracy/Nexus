/** @format */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Personal Information</span>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
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
                  defaultValue="Patient"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  defaultValue="User"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  defaultValue="patient@example.com"
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
                  defaultValue="+1 (555) 000-0000"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
