/** @format */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUser } from "@/lib/api/admin";
import { createAppointment } from "@/lib/api/appointments";

interface DoctorAssignmentModalProps {
  patient: AdminUser;
  doctors: AdminUser[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorAssignmentModal({
  patient,
  doctors,
  isOpen,
  onClose,
}: DoctorAssignmentModalProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentType, setAppointmentType] = useState("video");
  const [scheduleTime, setScheduleTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDoctor = doctors.find(
    (d) => d.id === parseInt(selectedDoctorId)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !scheduleTime) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createAppointment({
        patient_id: patient.id,
        professional_id: parseInt(selectedDoctorId),
        appointment_type: appointmentType,
        schedule_time: new Date(scheduleTime).toISOString(),
        duration: parseInt(duration),
        reason: reason,
        symptoms: symptoms,
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDoctorId("");
    setAppointmentType("video");
    setScheduleTime("");
    setDuration("30");
    setReason("");
    setSymptoms("");
    setError(null);
    onClose();
  };

  // Get minimum datetime (now)
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment between{" "}
            <span className="font-medium">{patient.first_name}</span> and a
            doctor
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Patient Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-medium text-blue-900">Patient</div>
            <div className="text-sm text-blue-800 mt-1">
              {patient.first_name} {patient.last_name}
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor *
            </label>
            <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    Dr. {doctor.first_name} {doctor.last_name}
                    {doctor.profile?.specialization &&
                      ` (${doctor.profile.specialization})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctor Info Preview */}
          {selectedDoctor && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="font-medium text-purple-900">Selected Doctor</div>
              <div className="text-sm text-purple-800 mt-1">
                Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
              </div>
              {selectedDoctor.profile?.specialization && (
                <div className="text-sm text-purple-700 mt-1">
                  Specialization: {selectedDoctor.profile.specialization}
                </div>
              )}
            </div>
          )}

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type *
            </label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Consultation</SelectItem>
                <SelectItem value="voice">Voice Call</SelectItem>
                <SelectItem value="clinic">Clinic Visit</SelectItem>
                <SelectItem value="bedside">Bedside Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                min={minDateTime}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <Input
                type="number"
                min="15"
                max="240"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Appointment *
            </label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Regular checkup, Follow-up consultation"
              required
            />
          </div>

          {/* Symptoms */}
          <div>
            <label
              htmlFor="symptoms"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Symptoms / Description
            </label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe any symptoms or additional context..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !selectedDoctorId || !scheduleTime}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create Appointment"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
