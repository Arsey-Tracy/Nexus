/** @format */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Video, Calendar, Clock } from "lucide-react";
import { requestConsultation } from "@/lib/api/consultations";

function ConsultationModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinueToPayment = () => {
    if (!symptoms) {
      setError("Please describe your symptoms.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const consultationNotes = `
        ${notes}
        Type: Virtual Consultation
        ${preferredDate ? `Preferred Date: ${preferredDate}` : ""}
        ${preferredTime ? `Preferred Time: ${preferredTime}` : ""}
          `.trim();
      const response = await requestConsultation(
        symptoms,
        consultationNotes,
        "virtual"
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
      // Use type assertion to safely access expected properties for error handling
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
    setSymptoms("");
    setNotes("");
    setPreferredDate("");
    setPreferredTime("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Book Virtual Consultation
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Connect with a doctor via secure video call
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-10">
              <div className="flex items-center w-full max-w-md">
                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= 1
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > 1 ? "✓" : "1"}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 font-medium">
                    Details
                  </span>
                </div>

                {/* Connector */}
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-all ${
                    step >= 2 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />

                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= 2
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs mt-2 text-gray-600 font-medium">
                    Payment
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Details */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Service Type Badge */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      Virtual Consultation
                    </span>
                  </div>
                </div>

                {/* Symptoms Field */}
                <div>
                  <label
                    htmlFor="symptoms"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    What symptoms are you experiencing?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Please describe your symptoms in detail (e.g., persistent headache, fever for 3 days, difficulty breathing)"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Be as specific as possible to help the doctor prepare
                  </p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="preferredDate"
                      className="block text-sm font-semibold text-gray-700 mb-2"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="preferredTime"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <Clock className="w-4 h-4 inline mr-1" />
                      Preferred Time
                    </label>
                    <Input
                      type="time"
                      id="preferredTime"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Additional Information{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any allergies, current medications, or other relevant medical history"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 gap-3">
                  <Button
                    type="button"
                    onClick={handleContinueToPayment}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    Continue to Payment →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Review & Confirm
                  </h3>
                  <p className="text-gray-600">
                    Please verify your consultation details
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 space-y-4">
                  <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Video className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Service Type
                        </p>
                        <p className="font-semibold text-gray-800">
                          Virtual Consultation
                        </p>
                      </div>
                    </div>
                  </div>

                  {preferredDate && preferredTime && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Scheduled For
                        </p>
                        <p className="font-semibold text-gray-800">
                          {new Date(preferredDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{preferredTime}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 bg-blue-50 -mx-6 px-6 py-4 rounded-b-xl">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Total Amount
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        UGX 50,000
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Secure payment</p>
                      <div className="flex gap-1 mt-1">
                        <div className="w-6 h-4 bg-gray-300 rounded"></div>
                        <div className="w-6 h-4 bg-gray-300 rounded"></div>
                        <div className="w-6 h-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-600 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Secure Payment Processing
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Your payment information is encrypted and protected
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Confirm & Pay"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationModal;
