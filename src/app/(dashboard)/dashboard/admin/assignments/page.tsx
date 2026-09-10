/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/Spinner";
import { getAdminUsers, AdminUser } from "@/lib/api/admin";
import DoctorAssignmentModal from "@/components/admin/DoctorAssignmentModal";

type UserType = "patient" | "doctor" | null;

export default function DoctorAssignmentPage() {
  const [patients, setPatients] = useState<AdminUser[]>([]);
  const [doctors, setDoctors] = useState<AdminUser[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<AdminUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchPatient]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAdminUsers();
      const patientsList = allUsers.filter((u) => u.user_type === "patient");
      const doctorsList = allUsers.filter((u) => u.user_type === "doctor" || u.user_type === "nurse");
      setPatients(patientsList);
      setDoctors(doctorsList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;

    if (searchPatient) {
      const searchLower = searchPatient.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.first_name.toLowerCase().includes(searchLower) ||
          patient.last_name.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPatients(filtered);
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
        <h1 className="text-3xl font-bold text-gray-900">
          Assign Doctors to Patients
        </h1>
        <p className="text-gray-600 mt-2">
          Create appointments and assign verified doctors to patients
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Patients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search patients..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
              />

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No patients found</p>
                ) : (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowModal(true);
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedPatient?.id === patient.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.email}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Form */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Assign Doctor to {selectedPatient.first_name}{" "}
                  {selectedPatient.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900">Patient Information</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedPatient.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedPatient.phone_number}
                    </div>
                    <div>
                      <span className="font-medium">Joined:</span>{" "}
                      {new Date(
                        selectedPatient.created_at
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Available Doctors */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Available Doctors ({doctors.length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {doctors.length === 0 ? (
                      <p className="text-gray-500 text-sm">No doctors available</p>
                    ) : (
                      doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className="p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">
                                Dr. {doctor.first_name} {doctor.last_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {doctor.email}
                              </div>
                              {doctor.profile?.specialization && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {doctor.profile.specialization}
                                </div>
                              )}
                            </div>
                            <Badge
                              variant={
                                doctor.profile?.admin_verification_status ===
                                "verified"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {doctor.profile?.admin_verification_status ===
                              "verified"
                                ? "Verified"
                                : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setSelectedPatient(null);
                      setShowModal(false);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={() => setShowModal(true)}
                    className="flex-1"
                    disabled={!selectedPatient}
                  >
                    Create Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-12">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">👈</div>
                  <p className="text-gray-500 font-medium">
                    Select a patient to assign a doctor
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedPatient && (
        <DoctorAssignmentModal
          patient={selectedPatient}
          doctors={doctors}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
