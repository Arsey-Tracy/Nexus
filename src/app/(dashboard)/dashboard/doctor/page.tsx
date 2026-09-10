/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Consultation, getMyConsultations } from "@/lib/api/consultations";
import { getDoctorProfileStatus } from "@/lib/api/profile";
import {
  getTodayAppointments,
  completeAppointment,
  Appointment,
} from "@/lib/api/appointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Lock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  DashboardPageShell,
  DashboardHeaderSection,
  StatCard,
  AlertBanner,
  EmptyState,
} from "@/components/layout/DashboardShell";

interface DoctorProfileStatus {
  is_complete: boolean;
  is_verified: boolean;
  can_receive_appointments: boolean;
  admin_verification_status: "pending" | "verified" | "rejected";
  missing_fields: string[];
  rejection_reason?: string;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [profileStatus, setProfileStatus] =
    useState<DoctorProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch profile status
        const statusData = await getDoctorProfileStatus();
        setProfileStatus(statusData);

        // Only fetch consultations if profile is complete and verified
        if (statusData.can_receive_appointments) {
          const consultationsData = await getMyConsultations();
          setConsultations(consultationsData);

          // Fetch today's appointments
          try {
            const appointmentsData = await getTodayAppointments();
            setTodayAppointments(appointmentsData);
          } catch (err) {
            console.error("Failed to fetch today's appointments:", err);
            setTodayAppointments([]);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkComplete = async (appointmentId: number) => {
    try {
      setCompletingId(appointmentId);
      await completeAppointment(appointmentId);
      // Refresh appointments
      const appointmentsData = await getTodayAppointments();
      setTodayAppointments(appointmentsData);
    } catch (err) {
      console.error("Failed to complete appointment:", err);
      alert("Failed to mark appointment as complete. Please try again.");
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardPageShell>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </DashboardPageShell>
    );
  }

  // Show warning if profile is incomplete
  if (profileStatus && !profileStatus.is_complete) {
    return (
      <DashboardPageShell>
        <DashboardHeaderSection
          title={`Welcome, Dr. ${user?.first_name ?? ""}`}
          subtitle="Complete your profile to activate your dashboard and start receiving appointments."
          badge={{ text: "Profile Incomplete", variant: "warning" }}
        />

        <AlertBanner
          title="Complete Your Profile"
          description={
            <>
              Your profile is incomplete. Please complete all required fields to activate your dashboard.
              <br />
              <br />
              <strong>Missing fields:</strong>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {profileStatus.missing_fields.map((field) => (
                  <li key={field}>
                    {field
                      .replace(/_/g, " ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </li>
                ))}
              </ul>
            </>
          }
          variant="warning"
          action={
            <Button
              onClick={() => router.push("/dashboard/doctor/profile")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Complete Profile
            </Button>
          }
        />

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="h-5 w-5" />
            <span className="font-semibold text-slate-700">Dashboard Locked</span>
          </div>
          <p className="text-slate-500 mt-2">
            Please complete your profile to access the dashboard features.
          </p>
        </div>
      </DashboardPageShell>
    );
  }

  // Show warning if profile is not verified by admin
  if (profileStatus && !profileStatus.is_verified) {
    return (
      <DashboardPageShell>
        <DashboardHeaderSection
          title={`Welcome, Dr. ${user?.first_name ?? ""}`}
          subtitle="Your dashboard will be unlocked once your profile is verified by our admin team."
          badge={{
            text:
              profileStatus.admin_verification_status === "pending"
                ? "Verification Pending"
                : "Verification Rejected",
            variant:
              profileStatus.admin_verification_status === "pending"
                ? "info"
                : "warning",
          }}
        />

        {profileStatus.admin_verification_status === "pending" && (
          <AlertBanner
            title="Admin Verification Pending"
            description={
              <>
                Your profile has been submitted for verification. Our admin team
                will review your credentials and contact you soon. This usually
                takes 24-48 hours.
                <br />
                <br />
                In the meantime, you can continue to update your profile
                information.
              </>
            }
            variant="info"
            action={
              <Button
                onClick={() => router.push("/dashboard/doctor/profile")}
                variant="outline"
              >
                Update Profile
              </Button>
            }
          />
        )}

        {profileStatus.admin_verification_status === "rejected" && (
          <AlertBanner
            title="Profile Verification Rejected"
            description={
              <>
                Your profile was not approved for the following reason:
                <br />
                <strong>{profileStatus.rejection_reason}</strong>
                <br />
                <br />
                Please update your profile and resubmit for verification.
              </>
            }
            variant="error"
            action={
              <Button
                onClick={() => router.push("/dashboard/doctor/profile")}
                className="bg-red-600 hover:bg-red-700"
              >
                Update Profile
              </Button>
            }
          />
        )}

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="h-5 w-5" />
            <span className="font-semibold text-slate-700">Dashboard Locked</span>
          </div>
          <p className="text-slate-500 mt-2">
            Your dashboard will be unlocked once your profile is verified by our
            admin team.
          </p>
        </div>
      </DashboardPageShell>
    );
  }

  // Profile is verified - show main dashboard
  if (error) {
    return (
      <DashboardPageShell>
        <AlertBanner
          title="Error"
          description={error}
          variant="error"
        />
      </DashboardPageShell>
    );
  }

  const upcomingConsultations = consultations.filter(
    (c) => c.status === "assigned",
  );

  return (
    <DashboardPageShell>
      <DashboardHeaderSection
        title={`Welcome, Dr. ${user?.first_name ?? ""}`}
        subtitle="Manage your consultations, appointments, and patient interactions."
        actions={
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Verified</span>
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Upcoming Consultations"
          value={upcomingConsultations.length}
          icon={Clock}
          iconColorClassName="text-sky-600 bg-sky-50 border-sky-100"
          description="Assigned consultations awaiting action"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments?.length || 0}
          icon={CheckCircle2}
          iconColorClassName="text-emerald-600 bg-emerald-50 border-emerald-100"
          description="Scheduled appointments for today"
        />
        <StatCard
          title="Total Consultations"
          value={consultations.length}
          icon={AlertTriangle}
          iconColorClassName="text-amber-600 bg-amber-50 border-amber-100"
          description="All time consultation requests"
        />
      </div>

      {/* Upcoming Consultations */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
          <h3 className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
            <span className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-sky-600" />
            </span>
            Upcoming Consultations
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {upcomingConsultations.length > 0 ? (
            <div className="space-y-3">
              {upcomingConsultations.map((c) => (
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
                  <div className="flex items-center space-x-2 shrink-0">
                    <Button
                      asChild
                      disabled={!c.patient.phone_number}
                      variant="default"
                    >
                      <a
                        href={`tel:${c.patient.phone_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Call Patient
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleMarkComplete(c.id as unknown as number)
                      }
                      disabled={completingId === c.id}
                    >
                      {completingId === c.id ? "Marking..." : "Mark Complete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming consultations"
              description="You have no assigned consultations at the moment."
              icon={CheckCircle2}
            />
          )}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
          <h3 className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
            <span className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            Today's Appointments
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {todayAppointments && todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="group rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-sm px-4 py-4 flex items-center justify-between gap-4 transition-all duration-150"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {appointment.patient_name}
                      </p>
                      <p className="text-xs text-slate-600">
                        {appointment.appointment_type}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(appointment.schedule_time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkComplete(appointment.id)}
                    disabled={completingId === appointment.id}
                  >
                    {completingId === appointment.id ? "..." : "Complete"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No appointments today"
              description="You have no appointments scheduled for today."
              icon={Clock}
            />
          )}
        </div>
      </div>

      {/* Patient Queue Section - Under Development */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50">
          <h3 className="flex items-center gap-2.5 text-base font-semibold text-amber-800">
            <span className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </span>
            Patient Queue
          </h3>
        </div>
        <div className="p-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              <strong>Coming Soon:</strong> Patient queue functionality is
              currently under development. This feature will be available soon.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Section - Under Development */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50">
          <h3 className="flex items-center gap-2.5 text-base font-semibold text-amber-800">
            <span className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </span>
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800 mb-3">
              <strong>Coming Soon:</strong> Additional quick actions are
              currently under development.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50">
              <Button variant="outline" disabled>
                Start Consultation
              </Button>
              <Button variant="outline" disabled>
                Write Prescription
              </Button>
              <Button variant="outline" disabled>
                Update Availability
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
