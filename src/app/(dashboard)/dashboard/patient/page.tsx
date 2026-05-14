/** @format */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { motion } from "framer-motion";
// import { Badge } from "@/components/ui/badge";
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
import { Consultation, getMyConsultations } from "@/lib/api/consultations";
import { BedsideNursing, getMyBedsideNursing } from "@/lib/api/bedside_nursing";
import { Video, Home, AlertCircle, Star, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewModal from "../../../../components/ReviewModal";
import ConsultationModal from "../../../../components/ConsultationModal";
import BedsideNursingModal from "../../../../components/BedsideNursingModal";

const statusConfig = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  assigned: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-400",
  },
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  completed: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  cancelled: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    dot: "bg-rose-400",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [bedsideNursing, setBedsideNursing] = useState<BedsideNursing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingConsultation, setReviewingConsultation] =
    useState<Consultation | null>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showBedsideNursingModal, setShowBedsideNursingModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [consultationsData, bedsideNursingData] = await Promise.all([
        getMyConsultations(),
        getMyBedsideNursing(),
      ]);
      setConsultations(consultationsData);
      setBedsideNursing(bedsideNursingData);
      setError(null);
    } catch (_err) {
      console.error("Failed to fetch data:", _err);
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
      setBedsideNursing([]);
      setError("Backend is currently unavailable. Showing sample data.");
    } finally {
      setLoading(false);
    }
  }, [user?.first_name, user?.last_name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBookingSuccess = () => {
    setShowConsultationModal(false);
    setShowBedsideNursingModal(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const hasHistory = consultations.length > 0 || bedsideNursing.length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto px-4 py-10 space-y-8"
    >
      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Hello, {user?.first_name} 👋
        </h1>
        <p className="text-slate-500 text-base">
          Manage your health consultations and home visits
        </p>
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Virtual Consultation */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowConsultationModal(true)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-left shadow-md shadow-blue-200 transition-shadow hover:shadow-lg hover:shadow-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
          <div className="absolute -right-8 -bottom-6 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Video className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-lg font-semibold text-white">
                Virtual Consultation
              </p>
              <p className="text-sm text-blue-100 mt-0.5">
                Connect with a doctor — from UGX 50,000
              </p>
            </div>
          </div>
        </motion.button>

        {/* Home Visit */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBedsideNursingModal(true)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-left shadow-md shadow-teal-200 transition-shadow hover:shadow-lg hover:shadow-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
          <div className="absolute -right-8 -bottom-6 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Home className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-lg font-semibold text-white">Home Visit</p>
              <p className="text-sm text-teal-100 mt-0.5">
                Care at your doorstep — from UGX 70,000
              </p>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* ── Medical History ── */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-slate-100 shadow-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Medical History
              </CardTitle>
              <CardDescription className="text-slate-400 mt-0.5">
                Your consultations and home visits
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowConsultationModal(true)}
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 gap-1.5"
              >
                <Video className="h-3.5 w-3.5" />
                Consult
              </Button>
              <Button
                onClick={() => setShowBedsideNursingModal(true)}
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 gap-1.5"
              >
                <Home className="h-3.5 w-3.5" />
                Home Visit
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <ScrollArea className="h-[560px] pr-2">
              {/* Error banner */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Empty state */}
              {!hasHistory ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                    <Home className="h-9 w-9 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    No medical history yet
                  </h3>
                  <p className="text-slate-400 text-sm mb-7 max-w-xs">
                    Book your first consultation or home visit to get started
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowConsultationModal(true)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Book Consultation
                    </Button>
                    <Button
                      onClick={() => setShowBedsideNursingModal(true)}
                      variant="outline"
                      className="rounded-xl border-slate-200 gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Book Home Visit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Consultations */}
                  {consultations.length > 0 && (
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <Video className="h-4 w-4 text-slate-400" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                          Virtual Consultations
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {consultations.map((c, i) => {
                          const sc =
                            statusConfig[c.status] ?? statusConfig.pending;
                          return (
                            <motion.div
                              key={`consultation-${c.id}`}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.3 }}
                              className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  {/* Status + date row */}
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span
                                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${sc.bg} ${sc.text} ${sc.border}`}
                                    >
                                      <span
                                        className={`h-1.5 w-1.5 rounded-full ${sc.dot}`}
                                      />
                                      {c.status.charAt(0).toUpperCase() +
                                        c.status.slice(1)}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        c.requested_at,
                                      ).toLocaleDateString("en-UG", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>

                                  {c.doctor && (
                                    <p className="font-semibold text-slate-900 text-[15px] mb-1">
                                      Dr. {c.doctor.first_name}{" "}
                                      {c.doctor.last_name}
                                    </p>
                                  )}
                                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                    {c.symptoms}
                                  </p>
                                </div>

                                <div className="flex shrink-0 flex-row sm:flex-col gap-2 sm:items-end">
                                  {c.status === "assigned" &&
                                    c.meeting_link && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              asChild
                                              size="sm"
                                              className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2"
                                            >
                                              <a
                                                href={c.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <Video className="h-3.5 w-3.5" />
                                                Join Call
                                              </a>
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Start your virtual consultation
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  {c.status === "completed" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setReviewingConsultation(c)
                                      }
                                      className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5"
                                    >
                                      <Star className="h-3.5 w-3.5" />
                                      Review
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Bedside Nursing */}
                  {bedsideNursing.length > 0 && (
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <Home className="h-4 w-4 text-slate-400" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                          Home Visits
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {bedsideNursing.map((b, i) => {
                          const sc =
                            statusConfig[b.status] ?? statusConfig.pending;
                          return (
                            <motion.div
                              key={`bedside-${b.id}`}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.3 }}
                              className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span
                                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${sc.bg} ${sc.text} ${sc.border}`}
                                    >
                                      <span
                                        className={`h-1.5 w-1.5 rounded-full ${sc.dot}`}
                                      />
                                      {b.status.charAt(0).toUpperCase() +
                                        b.status.slice(1)}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        b.requested_at,
                                      ).toLocaleDateString("en-UG", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>

                                  {b.doctor && (
                                    <p className="font-semibold text-slate-900 text-[15px] mb-1">
                                      Dr. {b.doctor.first_name}{" "}
                                      {b.doctor.last_name}
                                    </p>
                                  )}
                                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-1">
                                    {b.symptoms}
                                  </p>
                                  {b.address && (
                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                      <MapPin className="h-3 w-3" />
                                      {b.address}
                                    </span>
                                  )}
                                </div>

                                <div className="flex shrink-0 flex-row sm:flex-col gap-2 sm:items-end">
                                  {b.status === "completed" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                      View Details
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      {showConsultationModal && (
        <ConsultationModal
          onClose={() => setShowConsultationModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
      {showBedsideNursingModal && (
        <BedsideNursingModal
          onClose={() => setShowBedsideNursingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
      {reviewingConsultation && (
        <ReviewModal
          consultation={reviewingConsultation}
          onClose={() => setReviewingConsultation(null)}
          onReviewed={() => {
            setReviewingConsultation(null);
            fetchData();
          }}
        />
      )}
    </motion.div>
  );
}
