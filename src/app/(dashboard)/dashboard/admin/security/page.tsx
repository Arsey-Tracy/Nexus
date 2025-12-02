/** @format */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function SecurityPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">System Health &amp; Security</h1>
          <p className="text-gray-600">
            Monitor security policies and system integrity
          </p>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Security &amp; Privacy Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-800">
                  System Status: Secure
                </p>
                <p className="text-sm text-green-700">
                  All security checks passed
                </p>
              </div>
              <Button variant="outline">View Security Logs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
