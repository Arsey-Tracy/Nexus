/** @format */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { getAdminStats } from "@/lib/api/admin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Spinner from "@/components/Spinner";

interface ReportStats {
  total_users: number;
  total_patients: number;
  total_doctors: number;
  total_nurses: number;
  pending_doctor_verifications: number;
  verified_doctors: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

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
            Review platform statistics and backend-powered user analytics.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-600">
              {stats?.total_users ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats?.total_patients ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Patient accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doctors</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats?.total_doctors ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Medical professionals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nurses</CardTitle>
            <BarChart3 className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-600">
              {stats?.total_nurses ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Nurse accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats?.pending_doctor_verifications ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Doctors awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified Doctors</CardTitle>
            <BarChart3 className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">
              {stats?.verified_doctors ?? 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Approved doctors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              More advanced analytics, trends, and export features are under development. For now, user metrics are sourced directly from the backend.
            </p>
            <Button variant="outline" disabled>
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
