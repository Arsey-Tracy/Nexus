/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyConsultations } from "@/lib/api/consultations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading your schedule...</div>
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
  const completedConsultations = consultations.filter(
    (c) => c.status === "completed"
  );

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, Dr. {user?.first_name}
      </h1>

      {/* Upcoming Consultations */}
      <Card>
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
                      Requested on: {new Date(c.requested_at).toLocaleString()}
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
            <p className="text-gray-500">You have no upcoming consultations.</p>
          )}
        </CardContent>
      </Card>

      {/* Today's Appointments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No appointments scheduled for today.
          </p>
        </CardContent>
      </Card>

      {/* Patient Queue Section */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No patients currently in queue.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <Card>
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
  );
}
