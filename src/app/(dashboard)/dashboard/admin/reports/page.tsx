/** @format */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Reports &amp; Analytics</h1>
          <p className="text-gray-600">
            Review platform statistics and behavioral data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="app-card p-0">
          <Card className="rounded-none">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-700">Total Users</h3>
              <p className="text-3xl font-bold mt-2 text-sky-600">0</p>
            </CardContent>
          </Card>
        </div>
        <div className="app-card p-0">
          <Card className="rounded-none">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-700">Active Sessions</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">0</p>
            </CardContent>
          </Card>
        </div>
        <div className="app-card p-0">
          <Card className="rounded-none">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-700">Platform Uptime</h3>
              <p className="text-3xl font-bold mt-2 text-purple-600">100%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Advanced reporting tools coming soon...
              </p>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
