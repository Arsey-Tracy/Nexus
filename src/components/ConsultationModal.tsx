/** @format */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  X,
  Video,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Loader2,
} from "lucide-react";
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
    if (!symptoms.trim()) {
      setError("Please describe your symptoms before continuing.");
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
        "virtual",
      );

      if (response) {
        if (response.payment_link) {
          window.location.href = response.payment_link;
        } else {
          alert(
            "Consultation request submitted successfully! You will be contacted shortly.",
          );
          onSuccess();
        }
      }
    } catch (_err: unknown) {
      console.error("Consultation submission error:", _err);
      let errorMessage = "Failed to submit request. Please try again.";
      const err = _err as { data?: unknown };
      if (err?.data) {
        if (typeof err.data === "object") {
          const errors: string[] = [];
          Object.entries(err.data).forEach(
            ([field, messages]: [string, unknown]) => {
              if (Array.isArray(messages)) {
                errors.push(`${field}: ${messages.join(", ")}`);
              } else if (typeof messages === "string") {
                errors.push(`${field}: ${messages}`);
              }
            },
          );
          if (errors.length > 0) errorMessage = errors.join("\n");
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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh] sm:max-h-[90vh]"
      >
        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-5 shrink-0">
          {/* Drag handle (mobile) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-slate-200 sm:hidden" />

          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Video className="h-5 w-5 text-blue-600" />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold text-slate-900 leading-tight">
                Virtual Consultation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Secure video call with a doctor
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Step Indicator ── */}
        <div className="px-6 pb-5 shrink-0">
          <div className="flex items-center gap-2">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > 1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : "1"}
              </span>
              <span
                className={`text-xs font-medium ${step >= 1 ? "text-slate-700" : "text-slate-400"}`}
              >
                Your Details
              </span>
            </div>

            {/* Connector */}
            <div className="flex-1 h-px bg-slate-100 mx-1 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: step >= 2 ? "100%" : "0%" }}
                transition={{ duration: 0.35 }}
              />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  step >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                2
              </span>
              <span
                className={`text-xs font-medium ${step >= 2 ? "text-slate-700" : "text-slate-400"}`}
              >
                Review & Pay
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 shrink-0" />

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-5 space-y-5"
              >
                {/* Symptoms */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="symptoms"
                    className="block text-sm font-medium text-slate-700"
                  >
                    What symptoms are you experiencing?{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => {
                      setSymptoms(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. persistent headache, fever for 3 days, difficulty breathing…"
                    rows={4}
                    className="w-full resize-none rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <p className="text-xs text-slate-400">
                    Be specific — it helps the doctor prepare before your call.
                  </p>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="preferredDate"
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
                    >
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      id="preferredDate"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="rounded-xl border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="preferredTime"
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
                    >
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Preferred Time
                    </label>
                    <Input
                      type="time"
                      id="preferredTime"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="rounded-xl border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Additional information{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Allergies, current medications, or relevant medical history…"
                    rows={3}
                    className="w-full resize-none rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-5 space-y-4"
              >
                <p className="text-sm text-slate-500">
                  Review your details below before completing payment.
                </p>

                {/* Summary card */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100 overflow-hidden">
                  {/* Service */}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <Video className="h-4 w-4 text-blue-600" />
                    </span>
                    <div>
                      <p className="text-xs text-slate-400">Service</p>
                      <p className="text-sm font-semibold text-slate-800">
                        Virtual Consultation
                      </p>
                    </div>
                  </div>

                  {/* Symptoms summary */}
                  <div className="px-4 py-3.5">
                    <p className="text-xs text-slate-400 mb-1">Symptoms</p>
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                      {symptoms}
                    </p>
                  </div>

                  {/* Schedule */}
                  {(preferredDate || preferredTime) && (
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
                        <Calendar className="h-4 w-4 text-sky-600" />
                      </span>
                      <div>
                        <p className="text-xs text-slate-400">
                          Preferred Schedule
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {preferredDate
                            ? new Date(preferredDate).toLocaleDateString(
                                "en-UG",
                                {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                          {preferredTime && (
                            <span className="font-normal text-slate-500">
                              {" "}
                              · {preferredTime}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="flex items-center justify-between px-4 py-4 bg-blue-600">
                    <div>
                      <p className="text-xs text-blue-200">Total amount</p>
                      <p className="text-2xl font-bold text-white tracking-tight">
                        UGX 50,000
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-200">
                      <Shield className="h-3.5 w-3.5" />
                      <span className="text-xs">Secure payment</span>
                    </div>
                  </div>
                </div>

                {/* Trust note */}
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your payment and personal information are encrypted and
                    securely processed.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer Actions ── */}
        <div className="shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleContinueToPayment}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 shadow-sm shadow-blue-200"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 shadow-sm shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    Confirm & Pay
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ConsultationModal;
