/** @format */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Consultation,
  Doctor,
  getPendingConsultations,
  getAvailableDoctors,
  assignDoctorToConsultation,
} from "@/lib/api/consultations";
import Link from "next/link";
import { Badge, Bell, Heart, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

function AssignDoctorModal({
  consultation,
  doctors,
  onAssign,
  onClose,
  isAssigning,
}: {
  consultation: Consultation;
  doctors: Doctor[];
  onAssign: (consultationId: number, doctorId: number) => void;
  onClose: () => void;
  isAssigning: boolean;
}) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Assign Doctor for {consultation.patient.first_name}{" "}
          {consultation.patient.last_name}
        </h2>
        <p className="mb-2">
          <span className="font-semibold">Symptoms:</span>{" "}
          {consultation.symptoms}
        </p>
        <div className="space-y-4">
          <Select onValueChange={(value) => setSelectedDoctorId(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doc) => (
                <SelectItem key={doc.user.id} value={String(doc.user.id)}>
                  Dr. {doc.user.first_name} {doc.user.last_name} (
                  {doc.specialization})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onAssign(consultation.id, selectedDoctorId as number)
              }
              disabled={!selectedDoctorId || isAssigning}
            >
              {isAssigning ? "Assigning..." : "Confirm Assignment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [pending, setPending] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [pendingData, doctorsData] = await Promise.all([
        getPendingConsultations(),
        getAvailableDoctors(),
      ]);
      setPending(pendingData);
      setDoctors(doctorsData);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch data ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (consultationId: number, doctorId: number) => {
    setIsAssigning(true);
    try {
      await assignDoctorToConsultation(consultationId, doctorId);
      setSelectedConsultation(null); // Close modal
      await fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to assign doctor", error);
      alert("Assignment failed. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6 space-y-6">
      <header>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold mb-6">NexusCareUG</span>
              </Link>
              <Badge className="text-3xl font-bold mb-6">Admin Portal</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  8
                </Badge>
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/avatars/admin.jpg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-sm text-gray-500">System Administrator</p>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Pending Consultation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length > 0 ? (
              <div className="space-y-4">
                {pending.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {c.patient.first_name} {c.patient.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested on:{" "}
                        {new Date(c.requested_at).toLocaleString()}
                      </p>
                    </div>
                    <Button onClick={() => setSelectedConsultation(c)}>
                      Assign Doctor
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No pending requests.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedConsultation && (
        <AssignDoctorModal
          consultation={selectedConsultation}
          doctors={doctors}
          onAssign={handleAssign}
          onClose={() => setSelectedConsultation(null)}
          isAssigning={isAssigning}
        />
      )}
    </div>
  );
}
