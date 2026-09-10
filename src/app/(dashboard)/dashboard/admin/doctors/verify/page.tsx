/** @format */

"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/Spinner";
import {
  getPendingDoctors,
  verifyDoctor,
  DoctorForVerification,
} from "@/lib/api/admin";
import DoctorVerificationModal from "@/components/admin/DoctorVerificationModal";

export default function DoctorVerificationPage() {
  const [pendingDoctors, setPendingDoctors] = useState<DoctorForVerification[]>(
    []
  );
  const [verifiedDoctors, setVerifiedDoctors] = useState<
    DoctorForVerification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorForVerification | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const [pending, verified] = await Promise.all([
        getPendingDoctors("pending"),
        getPendingDoctors("verified"),
      ]);
      // Normalize responses: API may return an array or a paginated object { results: [] }
      const normalize = (value: any) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (value.results && Array.isArray(value.results)) return value.results;
        return [];
      };

      setPendingDoctors(normalize(pending));
      setVerifiedDoctors(normalize(verified));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (
    doctorId: number,
    status: "verified" | "rejected",
    notes: string
  ) => {
    try {
      await verifyDoctor(doctorId, {
        admin_verification_status: status,
        admin_verification_notes: notes,
      });

      // Refresh the doctors list
      await fetchDoctors();
      setShowModal(false);
      setSelectedDoctor(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to verify doctor"
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Verification</h1>
        <p className="text-gray-600 mt-2">
          Review and verify doctor profiles and credentials
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pendingDoctors.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({verifiedDoctors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingDoctors.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No pending doctor verifications
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelect={(doc) => {
                  setSelectedDoctor(doc);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="verified" className="space-y-4">
          {verifiedDoctors.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No verified doctors yet
                </p>
              </CardContent>
            </Card>
          ) : (
            verifiedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                verified
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {selectedDoctor && (
        <DoctorVerificationModal
          doctor={selectedDoctor}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedDoctor(null);
          }}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
}

interface DoctorCardProps {
  doctor: DoctorForVerification;
  verified?: boolean;
  onSelect?: (doctor: DoctorForVerification) => void;
}

function DoctorCard({ doctor, verified = false, onSelect }: DoctorCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {doctor.user.first_name} {doctor.user.last_name}
              </h3>
              <Badge
                variant={
                  verified
                    ? "default"
                    : doctor.admin_verification_status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {doctor.admin_verification_status.charAt(0).toUpperCase() +
                  doctor.admin_verification_status.slice(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Specialization:</span>{" "}
                {doctor.specialization}
              </div>
              <div>
                <span className="font-medium">Experience:</span>{" "}
                {doctor.years_of_experience} years
              </div>
              <div>
                <span className="font-medium">Registration:</span>{" "}
                {doctor.registration_number}
              </div>
            </div>
            <div>
              <span className="font-medium text-sm">Email:</span>{" "}
              <a
                href={`mailto:${doctor.user.email}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {doctor.user.email}
              </a>
            </div>
            {doctor.admin_verification_notes && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">Notes:</span>{" "}
                {doctor.admin_verification_notes}
              </div>
            )}
          </div>
          {!verified && (
            <div className="mt-4 md:mt-0 md:ml-4">
              <Button
                onClick={() => onSelect?.(doctor)}
                className="w-full md:w-auto"
                variant="default"
              >
                Review & Verify
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
