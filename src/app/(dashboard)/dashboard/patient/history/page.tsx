/** @format */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, AlertCircle } from "lucide-react";
import { getMyConsultations, Consultation } from "@/lib/api/consultations";
import { Alert, AlertDescription } from "@/components/ui/alert";

const HistoryPage = () => {
  const [medicalRecords, setMedicalRecords] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    approved: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyConsultations();
        
        if (response && Array.isArray(response)) {
          setMedicalRecords(response);
        } else if (response) {
          setMedicalRecords([response]);
        }
      } catch (err) {
        console.error("Failed to fetch consultations:", err);
        setError("Failed to load medical history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
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
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
            <span className="text-gray-600">Loading your history...</span>
          </div>
        </div>
      </motion.div>
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
        <FileText className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Medical History</h1>
          <p className="text-gray-600">
            Review your past consultations and medical records
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Consultation Records</CardTitle>
          </CardHeader>
          <CardContent>
            {medicalRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No consultation records found</p>
              </div>
            ) : (
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
                            {record.consultation_type ? 
                              record.consultation_type.charAt(0).toUpperCase() + 
                              record.consultation_type.slice(1) + " Consultation" 
                              : "Consultation"}
                          </h3>
                          <Badge className={statusColors[record.status] || "bg-gray-100 text-gray-800"}>
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {record.doctor?.first_name && record.doctor?.last_name
                            ? `Dr. ${record.doctor.first_name} ${record.doctor.last_name}`
                            : "Pending Doctor Assignment"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(record.requested_at)}
                        </p>
                        {record.symptoms && (
                          <p className="text-sm mt-2 text-gray-700">
                            <span className="font-medium">Symptoms:</span>{" "}
                            {record.symptoms}
                          </p>
                        )}
                        {record.notes && (
                          <p className="text-sm mt-1 text-gray-700">
                            <span className="font-medium">Notes:</span>{" "}
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default HistoryPage;
