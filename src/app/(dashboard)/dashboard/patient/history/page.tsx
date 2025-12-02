/** @format */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const HistoryPage = () => {
  const medicalRecords = [
    {
      id: 1,
      date: "Nov 15, 2024",
      doctor: "Dr. Smith",
      type: "Virtual Consultation",
      diagnosis: "Common Cold",
      status: "completed",
    },
    {
      id: 2,
      date: "Oct 28, 2024",
      doctor: "Dr. Johnson",
      type: "Bedside Checkup",
      diagnosis: "General Checkup",
      status: "completed",
    },
    {
      id: 3,
      date: "Oct 10, 2024",
      doctor: "Dr. Smith",
      type: "Virtual Consultation",
      diagnosis: "Allergy Assessment",
      status: "completed",
    },
  ];

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Medical History</h1>
          <p className="text-gray-600">
            Review your past consultations and medical records
          </p>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Consultation Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {record.type}
                        </h3>
                        <Badge className={statusColors[record.status]}>
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Dr. {record.doctor}
                      </p>
                      <p className="text-sm text-gray-600">{record.date}</p>
                      <p className="text-sm mt-2 text-gray-700">
                        <span className="font-medium">Diagnosis:</span>{" "}
                        {record.diagnosis}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default HistoryPage;
