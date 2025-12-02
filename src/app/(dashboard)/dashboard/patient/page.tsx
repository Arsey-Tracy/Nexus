/** @format */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  requestConsultation,
  Consultation,
  createReview,
  getMyConsultations,
} from "@/lib/api/consultations";
import { Video, Home, X, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Add these status color mappings
const statusColors = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  assigned: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  approved: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

function ConsultationModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState<
    "virtual" | "bedside" | null
  >(null);
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelection = (type: "virtual" | "bedside") => {
    setConsultationType(type);
    setStep(2);
  };

  const handleContinueToPayment = () => {
    if (!symptoms) {
      setError("Please describe your symptoms.");
      return;
    }
    if (consultationType === "bedside" && !address) {
      setError("Please provide your address for bedside service.");
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const consultationNotes = `
${notes}
Type: ${consultationType}
${preferredDate ? `Preferred Date: ${preferredDate}` : ""}
${preferredTime ? `Preferred Time: ${preferredTime}` : ""}
${address ? `Address: ${address}` : ""}
      `.trim();

      const response = await requestConsultation(
        symptoms,
        consultationNotes,
        consultationType as "virtual" | "bedside"
      );
      console.log("Consultation request response:", response);

      // Handle both response types:
      // 1. Direct Consultation object
      // 2. ConsultationRequestResponse with consultation + payment_link
      if (response) {
        // If there's a payment_link, redirect to payment
        if (response.payment_link) {
          window.location.href = response.payment_link;
        } else {
          // Otherwise, show success and refresh
          alert(
            "Consultation request submitted successfully! You will be contacted shortly."
          );
          onSuccess();
        }
      }
    } catch (_err: unknown) {
      // FIX: Changed 'any' to 'unknown'
      // log for diagnostics
      console.error("Consultation submission error:", _err);

      // Extract detailed error message from backend validation errors
      let errorMessage = "Failed to submit request. Please try again.";
      // Use type assertion to safey access expected properties for error handling
      const err = _err as { data?: unknown };
      if (err?.data) {
        // Handle Django REST Framework validation errors
        if (typeof err.data === "object") {
          const errors: string[] = [];
          Object.entries(err.data).forEach(
            ([field, messages]: [string, unknown]) => {
              if (Array.isArray(messages)) {
                errors.push(`${field}: ${messages.join(", ")}`);
              } else if (typeof messages === "string") {
                errors.push(`${field}: ${messages}`);
              }
            }
          );
          if (errors.length > 0) {
            errorMessage = errors.join("\n");
          }
        } else if (typeof err.data === "string") {
          errorMessage = err.data;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setConsultationType(null);
    setSymptoms("");
    setNotes("");
    setPreferredDate("");
    setPreferredTime("");
    setAddress("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Book Consultation</h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  step >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <div
                className={`w-16 h-1 ${
                  step >= 3 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step 1: Choose Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-6">
                Choose Consultation Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleTypeSelection("virtual")}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <Video className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h4 className="font-semibold text-lg mb-2">
                    Virtual Consultation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Video call with a doctor from the comfort of your home
                  </p>
                  <p className="text-blue-600 font-semibold mt-3">$50</p>
                </button>
                <button
                  onClick={() => handleTypeSelection("bedside")}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <Home className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h4 className="font-semibold text-lg mb-2">
                    Bedside Service
                  </h4>
                  <p className="text-sm text-gray-600">
                    A doctor will visit you at your location
                  </p>
                  <p className="text-green-600 font-semibold mt-3">$150</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold">
                  Selected:{" "}
                  {consultationType === "virtual"
                    ? "Virtual Consultation"
                    : "Bedside Service"}
                </p>
              </div>

              <div>
                <label htmlFor="symptoms" className="font-semibold block mb-2">
                  Symptoms*
                </label>
                <Textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., persistent headache, fever for 3 days"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="font-semibold block mb-2"
                  >
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Preferred Date
                  </label>
                  <Input
                    type="date"
                    id="preferredDate"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label
                    htmlFor="preferredTime"
                    className="font-semibold block mb-2"
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Preferred Time
                  </label>
                  <Input
                    type="time"
                    id="preferredTime"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                  />
                </div>
              </div>

              {consultationType === "bedside" && (
                <div>
                  <label htmlFor="address" className="font-semibold block mb-2">
                    Address*
                  </label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address including street, city, and postal code"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <label htmlFor="notes" className="font-semibold block mb-2">
                  Additional Notes (optional)
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., any known allergies, current medications"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="button" onClick={handleContinueToPayment}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Confirm & Pay</h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Consultation Type:</span>
                  <span className="capitalize">
                    {consultationType?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Amount:</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${consultationType === "virtual" ? "50" : "150"}
                  </span>
                </div>
                {preferredDate && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Preferred Date:</span>
                    <span>{new Date(preferredDate).toLocaleDateString()}</span>
                  </div>
                )}
                {preferredTime && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Preferred Time:</span>
                    <span>{preferredTime}</span>
                  </div>
                )}
              </div>

              <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
                <p className="font-semibold text-lg mb-2">
                  Payment Integration
                </p>
                <p className="text-sm text-gray-600">
                  Secure payment gateway (Stripe/PayPal) would be integrated
                  here
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Processing..." : "Confirm & Pay"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewModal({
  consultation,
  onClose,
  onReviewed,
}: {
  consultation: Consultation;
  onClose: () => void;
  onReviewed: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    setLoading(true);
    try {
      await createReview(consultation.id, rating, comment);
      onReviewed();
    } catch (_error) {
      console.error(_error);
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Leave a Review for Dr. {consultation.doctor?.first_name}
        </h2>
        <div className="flex justify-center my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingConsultation, setReviewingConsultation] =
    useState<Consultation | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyConsultations();
      setConsultations(data);
      setError(null);
    } catch (_err) {
      console.error("Failed to fetch consultations:", _err);
      // Show mock data when API fails, with a fallback message
      setConsultations([
        {
          id: 1,
          patient: {
            id: 1,
            first_name: user?.first_name || "Patient",
            last_name: user?.last_name || "User",
            phone_number: "",
          },
          doctor: { id: 1, first_name: "Smith", last_name: "Dr." },
          symptoms: "Regular checkup",
          status: "completed" as const,
          requested_at: new Date().toISOString(),
          scheduled_time: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
      ]);
      setError("Backend is currently unavailable. Showing sample data.");
    } finally {
      setLoading(false);
    }
  }, [user?.first_name, user?.last_name]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    fetchConsultations();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 space-y-8"
    >
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-gray-900"
        >
          Welcome back, {user?.first_name}
        </motion.h1>
        <p className="text-gray-600 mt-2">
          Manage your health consultations and appointments
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div className="app-card p-0">
            <Card className="rounded-none border-0">
              <CardContent className="p-6">
                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full h-auto py-8 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  size="lg"
                >
                  <Video className="w-8 h-8 mr-3" />
                  <div>
                    <div className="font-bold">Virtual Consultation</div>
                    <div className="text-sm opacity-90">From $50</div>
                  </div>
                </Button>
                <p className="text-sm text-center text-gray-600 mt-4">
                  Connect with a healthcare professional from anywhere
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div className="app-card p-0">
            <Card className="rounded-none border-0">
              <CardContent className="p-6">
                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full h-auto py-8 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  size="lg"
                >
                  <Home className="w-8 h-8 mr-3" />
                  <div>
                    <div className="font-bold">Home Visit</div>
                    <div className="text-sm opacity-90">From $150</div>
                  </div>
                </Button>
                <p className="text-sm text-center text-gray-600 mt-4">
                  Get medical care in the comfort of your home
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Consultation History */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Consultation History</CardTitle>
              <CardDescription>
                Track your medical consultations
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowBookingModal(true)}
              variant="outline"
              className="hidden md:flex"
            >
              Book New Consultation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button
                  variant="outline"
                  onClick={fetchConsultations}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : consultations.length > 0 ? (
              <div className="space-y-4">
                {consultations.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="secondary"
                                className={`${statusColors[c.status]?.bg} ${
                                  statusColors[c.status]?.text
                                }`}
                              >
                                {c.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(c.requested_at).toLocaleDateString()}
                              </span>
                            </div>
                            {c.doctor && (
                              <h3 className="text-lg font-semibold mb-2">
                                Dr. {c.doctor.first_name} {c.doctor.last_name}
                              </h3>
                            )}
                            <p className="text-gray-600">{c.symptoms}</p>
                          </div>
                          <div className="flex flex-row md:flex-col gap-3 justify-end">
                            {c.status === "assigned" && c.meeting_link && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button asChild className="w-full">
                                      <a
                                        href={c.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Video className="w-4 h-4 mr-2" />
                                        Join Call
                                      </a>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Start your virtual consultation</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {c.status === "completed" && (
                              <Button
                                variant="outline"
                                onClick={() => setReviewingConsultation(c)}
                                className="w-full"
                              >
                                Leave Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Consultations Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Book your first consultation to get started
                </p>
                <Button onClick={() => setShowBookingModal(true)}>
                  Book Consultation
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modals */}
      {showBookingModal && (
        <ConsultationModal
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {reviewingConsultation && (
        <ReviewModal
          consultation={reviewingConsultation}
          onClose={() => setReviewingConsultation(null)}
          onReviewed={() => {
            setReviewingConsultation(null);
            fetchConsultations();
          }}
        />
      )}
    </motion.div>
  );
}
