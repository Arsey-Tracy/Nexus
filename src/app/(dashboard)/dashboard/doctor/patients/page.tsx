/** @format */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, Calendar } from "lucide-react";

const PatientsPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(0);

  const patients = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 800 123 4567",
      age: 32,
      gender: "Male",
      lastVisit: "2024-11-28",
      status: "active",
      totalConsultations: 5,
      consultations: [
        {
          date: "2024-11-28",
          type: "Virtual",
          diagnosis: "Common Cold",
          status: "completed",
        },
        {
          date: "2024-11-15",
          type: "Bedside",
          diagnosis: "General Checkup",
          status: "completed",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 800 987 6543",
      age: 28,
      gender: "Female",
      lastVisit: "2024-11-20",
      status: "active",
      totalConsultations: 3,
      consultations: [
        {
          date: "2024-11-20",
          type: "Virtual",
          diagnosis: "Allergy Assessment",
          status: "completed",
        },
      ],
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+234 800 555 1234",
      age: 45,
      gender: "Male",
      lastVisit: "2024-10-15",
      status: "inactive",
      totalConsultations: 2,
      consultations: [
        {
          date: "2024-10-15",
          type: "Bedside",
          diagnosis: "Blood Pressure Check",
          status: "completed",
        },
      ],
    },
  ];

  const currentPatient = patients[selectedPatient];

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    completed: "bg-green-50 text-green-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Users className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">My Patients</h1>
          <p className="text-gray-600">
            View and manage your patient relationships
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <div className="app-card p-0">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>Patients ({patients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patients.map((patient, idx) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(idx)}
                      className={`w-full text-left p-3 rounded-lg transition-colors border ${
                        selectedPatient === idx
                          ? "bg-sky-100 border-sky-300"
                          : "hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-8 w-8 bg-sky-600 text-white text-xs flex items-center justify-center">
                          {patient.name.charAt(0)}
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {patient.name}
                          </p>
                          <Badge
                            className={`text-xs ${
                              patient.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {patient.totalConsultations} consultation
                        {patient.totalConsultations !== 1 ? "s" : ""}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="app-card p-0">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>Patient Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-sky-600 text-white text-lg flex items-center justify-center">
                      {currentPatient.name.charAt(0)}
                    </Avatar>
                    <div>
                      <p className="text-lg font-bold">{currentPatient.name}</p>
                      <Badge className={statusColors[currentPatient.status]}>
                        {currentPatient.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-600">Age / Gender</p>
                      <p className="font-semibold">
                        {currentPatient.age} / {currentPatient.gender.charAt(0)}
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-600">
                        Total Consultations
                      </p>
                      <p className="font-semibold">
                        {currentPatient.totalConsultations}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-sky-600" />
                      <a
                        href={`mailto:${currentPatient.email}`}
                        className="text-sky-600 hover:underline"
                      >
                        {currentPatient.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-sky-600" />
                      <a
                        href={`tel:${currentPatient.phone}`}
                        className="text-sky-600 hover:underline"
                      >
                        {currentPatient.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-sky-600" />
                      <span className="text-gray-600">
                        Last visit:{" "}
                        {new Date(
                          currentPatient.lastVisit
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full">Send Message</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consultation History */}
          <div className="app-card p-0">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>Consultation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentPatient.consultations.map((consultation, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {consultation.diagnosis}
                          </p>
                          <p className="text-sm text-gray-600">
                            {consultation.type} • Type
                          </p>
                        </div>
                        <Badge className={statusColors[consultation.status]}>
                          {consultation.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(consultation.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientsPage;
