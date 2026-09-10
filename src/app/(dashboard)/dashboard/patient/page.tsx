/**
 * @format
 * Patient Dashboard Page
 * Refactored to use separate components and custom hooks
 */

"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, Home } from "lucide-react";
import { Consultation } from "@/lib/api/consultations";
import ReviewModal from "../../../../components/ReviewModal";
import ConsultationModal from "../../../../components/ConsultationModal";
import BedsideNursingModal from "../../../../components/BedsideNursingModal";
import {
  QuickActionCards,
  MedicalHistorySection,
  LoadingState,
} from "./components";
import { useMedicalHistory } from "./hooks/useMedicalHistory";
import { containerVariants, itemVariants } from "./constants";
import {
  DashboardPageShell,
  DashboardHeaderSection,
  StatCard,
} from "@/components/layout/DashboardShell";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { consultations, bedsideNursing, loading, error, refetch } =
    useMedicalHistory();

  // Modal states
  const [reviewingConsultation, setReviewingConsultation] =
    useState<Consultation | null>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showBedsideNursingModal, setShowBedsideNursingModal] = useState(false);

  const handleBookingSuccess = () => {
    setShowConsultationModal(false);
    setShowBedsideNursingModal(false);
    refetch();
  };

  const openConsultationModal = () => setShowConsultationModal(true);
  const closeConsultationModal = () => setShowConsultationModal(false);
  const openHomeVisitModal = () => setShowBedsideNursingModal(true);
  const closeHomeVisitModal = () => setShowBedsideNursingModal(false);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <DashboardPageShell maxWidthClassName="max-w-4xl">
      {/* ── Header ── */}
      <DashboardHeaderSection
        title={`Hello, ${user?.first_name} 👋`}
        subtitle="Manage your health consultations and home visits"
      />

      {/* ── Quick Actions ── */}
      <QuickActionCards
        onConsultationClick={openConsultationModal}
        onHomeVisitClick={openHomeVisitModal}
      />

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
                onClick={openConsultationModal}
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 gap-1.5"
              >
                <Video className="h-3.5 w-3.5" />
                Consult
              </Button>
              <Button
                onClick={openHomeVisitModal}
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
            <ScrollArea className="h-140 pr-2">
              <MedicalHistorySection
                consultations={consultations}
                bedsideNursing={bedsideNursing}
                error={error}
                onConsultationReview={setReviewingConsultation}
                onRetry={refetch}
                onConsultationClick={openConsultationModal}
                onHomeVisitClick={openHomeVisitModal}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      {showConsultationModal && (
        <ConsultationModal
          onClose={closeConsultationModal}
          onSuccess={handleBookingSuccess}
        />
      )}
      {showBedsideNursingModal && (
        <BedsideNursingModal
          onClose={closeHomeVisitModal}
          onSuccess={handleBookingSuccess}
        />
      )}
      {reviewingConsultation && (
        <ReviewModal
          consultation={reviewingConsultation}
          onClose={() => setReviewingConsultation(null)}
          onReviewed={() => {
            setReviewingConsultation(null);
            refetch();
          }}
        />
      )}
    </DashboardPageShell>
  );
}
