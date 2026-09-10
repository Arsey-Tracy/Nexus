/** @format */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Consultation,
  Doctor,
  getPendingConsultations,
  getAvailableDoctors,
  assignDoctorToConsultation,
} from "@/lib/api/consultations";
import {
  getPendingDoctors,
  verifyDoctor,
  DoctorForVerification,
} from "@/lib/api/admin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  Award,
  RefreshCw,
  User,
  Stethoscope,
  Search,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DashboardPageShell,
  DashboardHeaderSection,
  StatCard,
  AlertBanner,
  EmptyState,
} from "@/components/layout/DashboardShell";

// ─── Shared design tokens ────────────────────────────────────────────────────
const cardShadow = "shadow-[0_2px_24px_-4px_rgba(15,23,42,0.1)]";
const fieldActive =
  "h-10 rounded-lg border border-slate-200 bg-white text-sm focus:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-0 placeholder:text-slate-400 transition-all duration-150";

// ─── AssignDoctorModal ───────────────────────────────────────────────────────
function AssignDoctorModal({
  consultation,
  doctors,
  onAssign,
  onClose,
  isAssigning,
}: {
  consultation: Consultation;
  doctors: Doctor[];
  onAssign: (consultationId: number, doctorId: number) => void;
  onClose: () => void;
  isAssigning: boolean;
}) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal header */}
        <div className="h-1 w-full bg-linear-to-r from-sky-400 via-blue-500 to-sky-600" />
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-sky-600 mb-0.5">
              Consultation Assignment
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              {consultation.patient.first_name} {consultation.patient.last_name}
            </h2>
          </div>
          <Button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Symptoms chip */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
              Reported Symptoms
            </p>
            <p className="text-sm text-slate-700">{consultation.symptoms}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Select Doctor
            </label>
            <Select onValueChange={(value) => setSelectedDoctorId(Number(value))}>
              <SelectTrigger className="h-10 rounded-lg border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400">
                <SelectValue placeholder="Choose an available doctor" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {doctors.map((doc) => (
                  <SelectItem key={doc.user.id} value={String(doc.user.id)} className="text-sm">
                    Dr. {doc.user.first_name} {doc.user.last_name} — {doc.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onAssign(consultation.id, selectedDoctorId as number)}
              disabled={!selectedDoctorId || isAssigning}
              className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md shadow-sky-600/20 transition-all"
            >
              {isAssigning ? "Assigning…" : "Confirm Assignment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DoctorVerificationModal ─────────────────────────────────────────────────
function DoctorVerificationModal({
  doctor,
  onVerify,
  onReject,
  onClose,
  isProcessing,
}: {
  doctor: DoctorForVerification;
  onVerify: (doctorId: number) => void;
  onReject: (doctorId: number, reason: string) => void;
  onClose: () => void;
  isProcessing: boolean;
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-sky-400 via-blue-500 to-sky-600" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-sky-600 mb-0.5">
              Doctor Review
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Dr. {doctor.user.first_name} {doctor.user.last_name}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{doctor.specialization}</p>
          </div>
          <Button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Mail className="h-3.5 w-3.5 text-sky-600" />, label: "Email", value: doctor.user.email },
              { icon: <Phone className="h-3.5 w-3.5 text-sky-600" />, label: "Phone", value: doctor.user.phone_number },
              { icon: <Award className="h-3.5 w-3.5 text-sky-600" />, label: "Experience", value: `${doctor.years_of_experience} years` },
              { icon: <Stethoscope className="h-3.5 w-3.5 text-sky-600" />, label: "Specialization", value: doctor.specialization },
              { icon: <FileText className="h-3.5 w-3.5 text-sky-600" />, label: "Registration No.", value: doctor.registration_number },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                  {icon} {label}
                </p>
                <p className="text-sm text-slate-800 font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Biography */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">Biography</p>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700 leading-relaxed">
              {doctor.biography || (
                <span className="text-slate-400 italic">No biography provided</span>
              )}
            </div>
          </div>

          {/* Licenses */}
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">Practicing Licenses</p>
            {doctor.practicing_licenses.length > 0 ? (
              <div className="space-y-2">
                {doctor.practicing_licenses.map((license, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-sky-600" />
                        {license.license_number}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Issued by {license.issuing_authority}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {license.issue_date} → {license.expiry_date}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase shrink-0 px-2 py-1 rounded-full ${
                        license.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {license.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-5 text-center">
                <FileText className="h-6 w-6 text-slate-300 mx-auto mb-1" />
                <p className="text-sm text-slate-400">No practicing licenses on file</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRejectionForm(!showRejectionForm)}
              disabled={isProcessing}
              className="h-9 px-4 rounded-xl text-sm font-semibold"
            >
              {showRejectionForm ? "Hide Rejection" : "Reject"}
            </Button>
            <Button
              onClick={() => onVerify(doctor.id)}
              disabled={isProcessing}
              className="h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all"
            >
              {isProcessing ? "Processing…" : "Approve"}
            </Button>
          </div>

          {/* Rejection form */}
          {showRejectionForm && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 space-y-3">
              <p className="text-sm font-semibold text-red-900">
                Reason for rejection
              </p>
              <Textarea
                placeholder="Explain why this application is being rejected…"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rounded-lg border-red-200 bg-white text-sm focus:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500/30 resize-none min-h-24"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectionForm(false)}
                  className="h-9 px-4 rounded-xl border-red-200 text-red-600 text-sm hover:bg-red-100"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (rejectionReason.trim()) {
                      onReject(doctor.id, rejectionReason);
                    } else {
                      alert("Please provide a rejection reason");
                    }
                  }}
                  disabled={isProcessing}
                  className="h-9 px-4 rounded-xl text-sm font-semibold"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AdminDashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("consultations");
  const [pending, setPending] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<DoctorForVerification[]>([]);
  const [doctorFilter, setDoctorFilter] = useState<"pending" | "verified" | "rejected">("pending");
  const [consultationSearch, setConsultationSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorForVerification | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [pendingData, doctorsData, pendingDoctorsData] = await Promise.all([
        getPendingConsultations(),
        getAvailableDoctors(),
        getPendingDoctors(doctorFilter),
      ]);

      const normalizeArray = <T,>(val: any): T[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val as T[];
        if (typeof val === "object" && Array.isArray((val as any).results))
          return (val as any).results as T[];
        return [];
      };

      setPending(normalizeArray<Consultation>(pendingData));
      setDoctors(normalizeArray<Doctor>(doctorsData));
      setPendingDoctors(normalizeArray<DoctorForVerification>(pendingDoctorsData));
      setError(null);
    } catch (err) {
      setError(`Failed to fetch data: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [doctorFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (consultationId: number, doctorId: number) => {
    setIsAssigning(true);
    try {
      await assignDoctorToConsultation(consultationId, doctorId);
      setSelectedConsultation(null);
      await fetchData();
    } catch (error) {
      console.error("Failed to assign doctor", error);
      alert("Assignment failed. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleVerifyDoctor = async (doctorId: number) => {
    setIsVerifying(true);
    try {
      await verifyDoctor(doctorId, { admin_verification_status: "verified" });
      setSelectedDoctor(null);
      await fetchData();
      alert("Doctor approved successfully!");
    } catch (error) {
      console.error("Failed to verify doctor", error);
      alert("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRejectDoctor = async (doctorId: number, reason: string) => {
    setIsVerifying(true);
    try {
      await verifyDoctor(doctorId, {
        admin_verification_status: "rejected",
        admin_verification_notes: reason,
      });
      setSelectedDoctor(null);
      await fetchData();
      alert("Doctor rejected successfully!");
    } catch (error) {
      console.error("Failed to reject doctor", error);
      alert("Rejection failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredConsultations = useMemo(
    () =>
      pending.filter((consultation) => {
        const query = consultationSearch.trim().toLowerCase();
        if (!query) return true;
        return [consultation.patient.first_name, consultation.patient.last_name, consultation.symptoms]
          .join(" ")
          .toLowerCase()
          .includes(query);
      }),
    [pending, consultationSearch],
  );

  const filteredDoctors = useMemo(
    () =>
      pendingDoctors.filter((doctor) => {
        const query = doctorSearch.trim().toLowerCase();
        if (!query) return true;
        return [
          doctor.user.first_name,
          doctor.user.last_name,
          doctor.specialization,
          doctor.registration_number,
          doctor.user.email,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      }),
    [pendingDoctors, doctorSearch],
  );

  const pendingDoctorCount = pendingDoctors.length;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading)
    return (
      <DashboardPageShell>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-10 rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </DashboardPageShell>
    );

  // ── Error state ────────────────────────────────────────────────────────────
  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <AlertBanner
            title="Something went wrong"
            description={error}
            variant="error"
          />
        </div>
      </div>
    );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <DashboardPageShell>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <DashboardHeaderSection
        title="Admin Console"
        subtitle="Oversee doctor approvals, consultation assignments, and platform activity."
        badge={{ text: "Admin Portal", variant: "info" }}
        actions={
          <Button
            variant="outline"
            onClick={fetchData}
            className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 gap-2 self-start sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Pending Consultations"
          value={pending.length}
          icon={Clock}
          iconColorClassName="text-sky-600 bg-sky-50 border-sky-100"
          description="Awaiting assignment"
        />
        <StatCard
          title="Doctor Queue"
          value={pendingDoctorCount}
          icon={User}
          iconColorClassName="text-amber-600 bg-amber-50 border-amber-100"
          description="Awaiting verification"
        />
        <StatCard
          title="Available Doctors"
          value={doctors.length}
          icon={CheckCircle2}
          iconColorClassName="text-emerald-600 bg-emerald-50 border-emerald-100"
          description="Ready for assignment"
        />
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="h-10 bg-slate-100 rounded-xl p-1 w-full grid grid-cols-2 gap-1">
            <TabsTrigger
              value="consultations"
              className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              Consultations
              {pending.length > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pending.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              Doctor Verification
              {pendingDoctors.length > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingDoctors.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Consultations tab ─────────────────────────────────────────── */}
          <TabsContent value="consultations" className="mt-4">
            <Card className={`border-0 ${cardShadow} bg-white rounded-2xl overflow-hidden`}>
              <CardHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
                  <span className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-sky-600" />
                  </span>
                  Pending Consultation Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-5 space-y-5">
                {/* Search bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Search by patient name or symptoms…"
                      value={consultationSearch}
                      onChange={(e) => setConsultationSearch(e.target.value)}
                      className={`${fieldActive} pl-9`}
                    />
                  </div>
                  {consultationSearch && (
                    <Button
                      variant="outline"
                      onClick={() => setConsultationSearch("")}
                      className="h-10 px-3 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {/* Results */}
                {filteredConsultations.length > 0 ? (
                  <div className="space-y-3">
                    {filteredConsultations.map((c) => (
                      <div
                        key={c.id}
                        className="group rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-200 hover:shadow-sm px-4 py-4 flex items-start justify-between gap-4 transition-all duration-150"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="h-4 w-4 text-sky-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">
                              {c.patient.first_name} {c.patient.last_name}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                              {c.symptoms}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {new Date(c.requested_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setSelectedConsultation(c)}
                          className="h-8 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shrink-0 shadow-sm shadow-sky-600/20 transition-all"
                        >
                          Assign
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : consultationSearch ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-center">
                    <Search className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500">No consultations matched</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try a different search term.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-8 text-center">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-700">All caught up</p>
                    <p className="text-xs text-emerald-600/70 mt-0.5">No pending consultation requests.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Doctor Verification tab ───────────────────────────────────── */}
          <TabsContent value="doctors" className="mt-4">
            <Card className={`border-0 ${cardShadow} bg-white rounded-2xl overflow-hidden`}>
              <CardHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
                    <span className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center">
                      <Stethoscope className="h-3.5 w-3.5 text-sky-600" />
                    </span>
                    Doctor Verification
                  </CardTitle>

                  {/* Status filter pills */}
                  <div className="flex gap-2">
                    {(["pending", "verified", "rejected"] as const).map((status) => (
                      <Button
                        key={status}
                        onClick={() => setDoctorFilter(status)}
                        className={`h-7 px-3 rounded-full text-[11px] font-semibold tracking-wide transition-all ${
                          doctorFilter === status
                            ? status === "verified"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : status === "rejected"
                              ? "bg-red-500 text-white shadow-sm"
                              : "bg-sky-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Review applications and manage the doctor verification queue.
                </p>
              </CardHeader>

              <CardContent className="px-6 py-5 space-y-5">
                {/* Search bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Search by name, specialty, or registration number…"
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className={`${fieldActive} pl-9`}
                    />
                  </div>
                  {doctorSearch && (
                    <Button
                      variant="outline"
                      onClick={() => setDoctorSearch("")}
                      className="h-10 px-3 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {/* Doctor list */}
                {filteredDoctors.length > 0 ? (
                  <div className="space-y-3">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="group rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-200 hover:shadow-sm px-4 py-4 flex items-start justify-between gap-4 transition-all duration-150"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-white text-xs font-bold">
                              {(doctor.user.first_name?.[0] || "") + (doctor.user.last_name?.[0] || "")}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-slate-900">
                                Dr. {doctor.user.first_name} {doctor.user.last_name}
                              </p>
                              {/* Status badge */}
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                                  doctor.admin_verification_status === "verified"
                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                    : doctor.admin_verification_status === "rejected"
                                    ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                                    : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                }`}
                              >
                                {doctor.admin_verification_status === "pending" && <Clock className="h-2.5 w-2.5" />}
                                {doctor.admin_verification_status === "verified" && <CheckCircle2 className="h-2.5 w-2.5" />}
                                {doctor.admin_verification_status === "rejected" && <XCircle className="h-2.5 w-2.5" />}
                                {doctor.admin_verification_status}
                              </span>
                              {!doctor.is_profile_complete && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 ring-1 ring-orange-200">
                                  ⚠ Incomplete
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600">
                              {doctor.specialization} · {doctor.years_of_experience} yrs exp.
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Reg. {doctor.registration_number} · Applied {new Date(doctor.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {doctor.admin_verification_status === "pending" ? (
                          <Button
                            onClick={() => setSelectedDoctor(doctor)}
                            className="h-8 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shrink-0 shadow-sm shadow-sky-600/20 transition-all"
                          >
                            Review
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setSelectedDoctor(doctor)}
                            variant="outline"
                            className="h-8 px-3.5 rounded-lg border-slate-200 text-slate-600 text-xs font-medium shrink-0 hover:bg-slate-50"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : doctorSearch ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-center">
                    <Search className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500">No doctors matched</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try a different search term or status filter.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-8 text-center">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-700">Queue is clear</p>
                    <p className="text-xs text-emerald-600/70 mt-0.5">No {doctorFilter} doctors at this time.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {selectedConsultation && (
        <AssignDoctorModal
          consultation={selectedConsultation}
          doctors={doctors}
          onAssign={handleAssign}
          onClose={() => setSelectedConsultation(null)}
          isAssigning={isAssigning}
        />
      )}

      {selectedDoctor && (
        <DoctorVerificationModal
          doctor={selectedDoctor}
          onVerify={handleVerifyDoctor}
          onReject={handleRejectDoctor}
          onClose={() => setSelectedDoctor(null)}
          isProcessing={isVerifying}
        />
      )}
    </DashboardPageShell>
  );
}