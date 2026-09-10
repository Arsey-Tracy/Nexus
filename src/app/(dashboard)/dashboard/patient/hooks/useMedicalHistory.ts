/**
 * @format
 * useMedicalHistory Hook
 * Handles fetching and managing medical history data
 */

import { useState, useEffect, useCallback } from "react";
import { Consultation, getMyConsultations } from "@/lib/api/consultations";
import { BedsideNursing, getMyBedsideNursing } from "@/lib/api/bedside_nursing";
import { useAuth } from "@/lib/auth/AuthContext";

interface UseMedicalHistoryReturn {
  consultations: Consultation[];
  bedsideNursing: BedsideNursing[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMedicalHistory(): UseMedicalHistoryReturn {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [bedsideNursing, setBedsideNursing] = useState<BedsideNursing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      console.error("Failed to fetch medical history:", err);
      setConsultations([]);
      setBedsideNursing([]);
      setError(
        "Unable to load your medical history. Please check your connection or try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.first_name, user?.last_name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    consultations,
    bedsideNursing,
    loading,
    error,
    refetch: fetchData,
  };
}
