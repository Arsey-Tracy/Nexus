/** @format */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function SettingsPage() {
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
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-gray-600">
            Configure platform preferences and options
          </p>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Settings configuration interface coming soon...
              </p>
              <Button variant="outline">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
