/**
 * @format
 * MedicalHistorySection Component
 * Displays consultations and home visits in separate sections
 */

"use client";

import React from "react";
import { Video, Home } from "lucide-react";
import { Consultation } from "@/lib/api/consultations";
import { BedsideNursing } from "@/lib/api/bedside_nursing";
import { ConsultationCard } from "./ConsultationCard";
import { BedsideNursingCard } from "./BedsideNursingCard";
import { EmptyState } from "./EmptyState";
import { ErrorBanner } from "./ErrorBanner";

interface MedicalHistorySectionProps {
  consultations: Consultation[];
  bedsideNursing: BedsideNursing[];
  error: string | null;
  onConsultationReview: (consultation: Consultation) => void;
  onRetry: () => void;
  onConsultationClick: () => void;
  onHomeVisitClick: () => void;
}

export function MedicalHistorySection({
  consultations,
  bedsideNursing,
  error,
  onConsultationReview,
  onRetry,
  onConsultationClick,
  onHomeVisitClick,
}: MedicalHistorySectionProps) {
  const hasHistory = consultations.length > 0 || bedsideNursing.length > 0;

  return (
    <div>
      {/* Error banner */}
      {error && <ErrorBanner error={error} onRetry={onRetry} />}

      {/* Empty state */}
      {!hasHistory ? (
        <EmptyState
          onConsultationClick={onConsultationClick}
          onHomeVisitClick={onHomeVisitClick}
        />
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
                {consultations.map((consultation, i) => (
                  <ConsultationCard
                    key={`consultation-${consultation.id}`}
                    consultation={consultation}
                    index={i}
                    onReview={onConsultationReview}
                  />
                ))}
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
                {bedsideNursing.map((bedside, i) => (
                  <BedsideNursingCard
                    key={`bedside-${bedside.id}`}
                    bedside={bedside}
                    index={i}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
