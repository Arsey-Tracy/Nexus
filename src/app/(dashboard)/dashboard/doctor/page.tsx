/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyConsultations } from "@/lib/api/consultations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Define interfaces for type safety
interface Patient {
  first_name: string;
  last_name: string;
}

interface Consultation {
  id: number;
  patient: Patient;
  symptoms: string;
  status: "pending" | "assigned" | "completed" | "approved" | "cancelled";
  requested_at: string;
  meeting_link?: string;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const data = await getMyConsultations();
        setConsultations(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch consultations:", err);
        setError("Failed to fetch consultations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
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

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const upcomingConsultations = consultations.filter(
    (c) => c.status === "assigned"
  );
  // completedConsultations intentionally omitted for now to avoid unused variable

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, Dr. {user?.first_name ?? ""}
      </h1>

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
                        disabled={!c.meeting_link}
                        variant="default"
                      >
                        <a
                          href={c.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Call
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
