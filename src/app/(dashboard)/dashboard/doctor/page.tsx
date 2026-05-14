/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyConsultations } from "@/lib/api/consultations";
import { getDoctorProfileStatus } from "@/lib/api/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock, CheckCircle2, Clock } from "lucide-react";

// Define interfaces for type safety
interface Patient {
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface Consultation {
  id: number;
  patient: Patient;
  symptoms: string;
  status: "pending" | "assigned" | "completed" | "approved" | "cancelled";
  requested_at: string;
  meeting_link?: string;
}

interface DoctorProfileStatus {
  is_complete: boolean;
  is_verified: boolean;
  can_receive_appointments: boolean;
  admin_verification_status: "pending" | "verified" | "rejected";
  missing_fields: string[];
  rejection_reason?: string;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [profileStatus, setProfileStatus] =
    useState<DoctorProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch profile status
        const statusData = await getDoctorProfileStatus();
        setProfileStatus(statusData);

        // Only fetch consultations if profile is complete and verified
        if (statusData.can_receive_appointments) {
          const consultationsData = await getMyConsultations();
          setConsultations(consultationsData);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  // Show warning if profile is incomplete
  if (profileStatus && !profileStatus.is_complete) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, Dr. {user?.first_name ?? ""}
        </h1>

        <Alert className="border-orange-500 bg-orange-50">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-800 font-semibold">
            Complete Your Profile
          </AlertTitle>
          <AlertDescription className="text-orange-700 mt-2">
            Your profile is incomplete. Please complete all required fields to
            activate your dashboard.
            <br />
            <br />
            <strong>Missing fields:</strong>
            <ul className="list-disc ml-5 mt-2">
              {profileStatus.missing_fields.map((field) => (
                <li key={field}>
                  {field
                    .replace(/_/g, " ")
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </li>
              ))}
            </ul>
            <br />
            <Button
              onClick={() => router.push("/dashboard/doctor/profile")}
              className="mt-4 bg-orange-600 hover:bg-orange-700"
            >
              Complete Profile
            </Button>
          </AlertDescription>
        </Alert>

        <Card className="border-gray-200 opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Dashboard Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Please complete your profile to access the dashboard features.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show warning if profile is not verified by admin
  if (profileStatus && !profileStatus.is_verified) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, Dr. {user?.first_name ?? ""}
        </h1>

        {profileStatus.admin_verification_status === "pending" && (
          <Alert className="border-blue-500 bg-blue-50">
            <Clock className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">
              Admin Verification Pending
            </AlertTitle>
            <AlertDescription className="text-blue-700 mt-2">
              Your profile has been submitted for verification. Our admin team
              will review your credentials and contact you soon. This usually
              takes 24-48 hours.
              <br />
              <br />
              In the meantime, you can continue to update your profile
              information.
              <div className="mt-4">
                <Button
                  onClick={() => router.push("/dashboard/doctor/profile")}
                  variant="outline"
                >
                  Update Profile
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {profileStatus.admin_verification_status === "rejected" && (
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800 font-semibold">
              Profile Verification Rejected
            </AlertTitle>
            <AlertDescription className="text-red-700 mt-2">
              Your profile was not approved for the following reason:
              <br />
              <strong>{profileStatus.rejection_reason}</strong>
              <br />
              <br />
              Please update your profile and resubmit for verification.
              <div className="mt-4">
                <Button
                  onClick={() => router.push("/dashboard/doctor/profile")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Update Profile
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-gray-200 opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Dashboard Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Your dashboard will be unlocked once your profile is verified by
              our admin team.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile is verified - show main dashboard
  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const upcomingConsultations = consultations.filter(
    (c) => c.status === "assigned",
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, Dr. {user?.first_name ?? ""}
        </h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-medium">Verified</span>
        </div>
      </div>

      {/* Upcoming Consultations */}
      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Upcoming Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingConsultations.length > 0 ? (
              <div className="space-y-4">
                {upcomingConsultations.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">
                        Patient: {c.patient.first_name} {c.patient.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Symptoms: {c.symptoms}
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested on:{" "}
                        {new Date(c.requested_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        asChild
                        disabled={!c.patient.phone_number}
                        variant="default"
                      >
                        <a
                          href={`tel:${c.patient.phone_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Call Patient
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // TODO: Implement mark as complete
                          console.log("Mark as complete:", c.id);
                        }}
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                You have no upcoming consultations.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments Section */}
      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Today&apos;s Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No appointments scheduled for today.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Queue Section */}
      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Patient Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No patients currently in queue.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => console.log("Start consultation")}
              >
                Start Consultation
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Write prescription")}
              >
                Write Prescription
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Update availability")}
              >
                Update Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
