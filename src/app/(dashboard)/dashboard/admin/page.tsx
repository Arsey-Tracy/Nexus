/** @format */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  getPendingDoctors,
  verifyDoctor,
  DoctorForVerification,
} from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  Award,
} from "lucide-react";

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

function DoctorVerificationModal({
  doctor,
  onVerify,
  onReject,
  onClose,
  isProcessing,
}: {
  doctor: DoctorForVerification;
  onVerify: (doctorId: number) => void;
  onReject: (doctorId: number, reason: string) => void;
  onClose: () => void;
  isProcessing: boolean;
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl my-8">
        <h2 className="text-2xl font-bold mb-6">Verify Doctor Profile</h2>

        {/* Doctor Information */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-gray-600">Name</p>
            <p className="text-lg">
              Dr. {doctor.user.first_name} {doctor.user.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Email</p>
            <p className="text-lg flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {doctor.user.email}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Phone</p>
            <p className="text-lg flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {doctor.user.phone_number}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Experience</p>
            <p className="text-lg flex items-center gap-2">
              <Award className="h-4 w-4" />
              {doctor.years_of_experience} years
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Specialization
            </p>
            <p className="text-lg">{doctor.specialization}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Registration Number
            </p>
            <p className="text-lg">{doctor.registration_number}</p>
          </div>
        </div>

        {/* Biography */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">Biography</p>
          <p className="p-3 bg-gray-50 rounded text-gray-700">
            {doctor.biography || "No biography provided"}
          </p>
        </div>

        {/* Practicing Licenses */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Practicing Licenses
          </p>
          <div className="space-y-2">
            {doctor.practicing_licenses.length > 0 ? (
              doctor.practicing_licenses.map((license, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50 rounded border border-blue-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {license.license_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        Issued by: {license.issuing_authority}
                      </p>
                      <p className="text-sm text-gray-600">
                        Valid from {license.issue_date} to {license.expiry_date}
                      </p>
                    </div>
                    <Badge
                      variant={license.is_active ? "default" : "secondary"}
                    >
                      {license.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No practicing licenses found</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end mt-8">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowRejectionForm(!showRejectionForm)}
            disabled={isProcessing}
          >
            Reject
          </Button>
          <Button
            onClick={() => onVerify(doctor.id)}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? "Processing..." : "Approve"}
          </Button>
        </div>

        {/* Rejection Form */}
        {showRejectionForm && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="font-semibold text-red-900 mb-2">
              Why are you rejecting this doctor?
            </p>
            <Textarea
              placeholder="Provide rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRejectionForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (rejectionReason.trim()) {
                    onReject(doctor.id, rejectionReason);
                  } else {
                    alert("Please provide a rejection reason");
                  }
                }}
                disabled={isProcessing}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("consultations");
  const [pending, setPending] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<DoctorForVerification[]>(
    [],
  );
  const [doctorFilter, setDoctorFilter] = useState<
    "pending" | "verified" | "rejected"
  >("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorForVerification | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [pendingData, doctorsData, pendingDoctorsData] = await Promise.all([
        getPendingConsultations(),
        getAvailableDoctors(),
        getPendingDoctors(doctorFilter),
      ]);
      setPending(pendingData);
      setDoctors(doctorsData);
      setPendingDoctors(pendingDoctorsData);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch data: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [doctorFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (consultationId: number, doctorId: number) => {
    setIsAssigning(true);
    try {
      await assignDoctorToConsultation(consultationId, doctorId);
      setSelectedConsultation(null);
      await fetchData();
    } catch (error) {
      console.error("Failed to assign doctor", error);
      alert("Assignment failed. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleVerifyDoctor = async (doctorId: number) => {
    setIsVerifying(true);
    try {
      await verifyDoctor(doctorId, {
        admin_verification_status: "verified",
      });
      setSelectedDoctor(null);
      await fetchData();
      alert("Doctor approved successfully!");
    } catch (error) {
      console.error("Failed to verify doctor", error);
      alert("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRejectDoctor = async (doctorId: number, reason: string) => {
    setIsVerifying(true);
    try {
      await verifyDoctor(doctorId, {
        admin_verification_status: "rejected",
        admin_verification_notes: reason,
      });
      setSelectedDoctor(null);
      await fetchData();
      alert("Doctor rejected successfully!");
    } catch (error) {
      console.error("Failed to reject doctor", error);
      alert("Rejection failed. Please try again.");
    } finally {
      setIsVerifying(false);
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

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage consultations and verify doctors
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="consultations"
            className="flex items-center gap-2"
          >
            Consultations
            {pending.length > 0 && (
              <Badge variant="destructive">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            Doctor Verification
            {pendingDoctors.filter(
              (d) => d.admin_verification_status === "pending",
            ).length > 0 && (
              <Badge variant="destructive">
                {
                  pendingDoctors.filter(
                    (d) => d.admin_verification_status === "pending",
                  ).length
                }
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Consultations Tab */}
        <TabsContent value="consultations" className="app-card p-0">
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
                      className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-semibold">
                          {c.patient.first_name} {c.patient.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Symptoms: {c.symptoms}
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
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>All Caught Up</AlertTitle>
                  <AlertDescription>
                    No pending consultation requests.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Doctor Verification Tab */}
        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Verification</CardTitle>
              <div className="flex gap-2 mt-4">
                {(["pending", "verified", "rejected"] as const).map(
                  (status) => (
                    <Button
                      key={status}
                      variant={doctorFilter === status ? "default" : "outline"}
                      onClick={() => setDoctorFilter(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ),
                )}
              </div>
            </CardHeader>
            <CardContent>
              {pendingDoctors.length > 0 ? (
                <div className="space-y-4">
                  {pendingDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="p-4 border rounded-lg flex justify-between items-start hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-lg">
                            Dr. {doctor.user.first_name} {doctor.user.last_name}
                          </p>
                          <Badge
                            variant={
                              doctor.admin_verification_status === "verified"
                                ? "default"
                                : doctor.admin_verification_status ===
                                    "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {doctor.admin_verification_status === "pending" && (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {doctor.admin_verification_status ===
                              "verified" && (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            )}
                            {doctor.admin_verification_status ===
                              "rejected" && (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {doctor.admin_verification_status}
                          </Badge>
                          {!doctor.is_profile_complete && (
                            <Badge
                              variant="outline"
                              className="border-orange-300"
                            >
                              ⚠ Incomplete Profile
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {doctor.specialization} • {doctor.years_of_experience}{" "}
                          years exp.
                        </p>
                        <p className="text-sm text-gray-500">
                          Registration: {doctor.registration_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          Email: {doctor.user.email}
                        </p>
                        <p className="text-sm text-gray-400">
                          Applied:{" "}
                          {new Date(doctor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        {doctor.admin_verification_status === "pending" && (
                          <Button
                            onClick={() => setSelectedDoctor(doctor)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Review
                          </Button>
                        )}
                        {doctor.admin_verification_status !== "pending" && (
                          <Button
                            onClick={() => setSelectedDoctor(doctor)}
                            variant="outline"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>No {doctorFilter} doctors</AlertTitle>
                  <AlertDescription>
                    There are no doctors in {doctorFilter} status.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedConsultation && (
        <AssignDoctorModal
          consultation={selectedConsultation}
          doctors={doctors}
          onAssign={handleAssign}
          onClose={() => setSelectedConsultation(null)}
          isAssigning={isAssigning}
        />
      )}

      {selectedDoctor && (
        <DoctorVerificationModal
          doctor={selectedDoctor}
          onVerify={handleVerifyDoctor}
          onReject={handleRejectDoctor}
          onClose={() => setSelectedDoctor(null)}
          isProcessing={isVerifying}
        />
      )}
    </div>
  );
}
