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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DoctorForVerification } from "@/lib/api/admin";

interface DoctorVerificationModalProps {
  doctor: DoctorForVerification;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (
    doctorId: number,
    status: "verified" | "rejected",
    notes: string
  ) => void;
}

export default function DoctorVerificationModal({
  doctor,
  isOpen,
  onClose,
  onVerify,
}: DoctorVerificationModalProps) {
  const [status, setStatus] = useState<"verified" | "rejected" | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;

    try {
      setLoading(true);
      await onVerify(doctor.id, status, notes);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setStatus(null);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Verify Doctor: {doctor.user.first_name} {doctor.user.last_name}
          </DialogTitle>
          <DialogDescription>
            Review the doctor's profile and credentials before making a decision
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Doctor Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <p className="mt-1">{`${doctor.user.first_name} ${doctor.user.last_name}`}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="mt-1">{doctor.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="mt-1">{doctor.user.phone_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Specialization
                </label>
                <p className="mt-1">{doctor.specialization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Years of Experience
                </label>
                <p className="mt-1">{doctor.years_of_experience} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Registration Number
                </label>
                <p className="mt-1">{doctor.registration_number}</p>
              </div>
            </div>
          </div>

          {/* Biography */}
          {doctor.biography && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Biography
              </label>
              <p className="mt-1 text-gray-700">{doctor.biography}</p>
            </div>
          )}

          {/* Practicing Licenses */}
          {doctor.practicing_licenses.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Practicing Licenses
              </label>
              <div className="mt-2 space-y-2">
                {doctor.practicing_licenses.map((license, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-gray-200 rounded-lg text-sm"
                  >
                    <div className="font-medium">{license.license_number}</div>
                    <div className="text-gray-600">
                      {license.issuing_authority}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {license.issue_date} to {license.expiry_date}
                    </div>
                    <Badge className="mt-2" variant={license.is_active ? "default" : "destructive"}>
                      {license.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Decision
              </label>
              <div className="mt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("verified")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    status === "verified"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("rejected")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    status === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  status === "rejected"
                    ? "Explain why this doctor was rejected..."
                    : "Add any additional notes..."
                }
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={!status || loading}
                className="flex-1"
              >
                {loading ? "Processing..." : "Submit Decision"}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
