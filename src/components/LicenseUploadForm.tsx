/** @format */

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createPracticingLicense, PracticingLicense } from "@/lib/api/profile";
import { extractErrors } from "@/lib/api/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function LicenseUploadForm({
  onSuccess,
}: {
  onSuccess?: (license: PracticingLicense) => void;
}) {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [umdpcFile, setUmdpcFile] = useState<File | null>(null);
  const [foreignFile, setForeignFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const resetForm = () => {
    setLicenseNumber("");
    setIssuingAuthority("");
    setIssueDate("");
    setExpiryDate("");
    setUmdpcFile(null);
    setForeignFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setModalState({ open: false, type: "success", title: "", message: "" });

    if (!licenseNumber || !issuingAuthority || !issueDate || !expiryDate || !umdpcFile) {
      setModalState({
        open: true,
        type: "error",
        title: "Missing required details",
        message: "Please fill all required license fields and upload the UMDPC certificate.",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("license_number", licenseNumber.trim());
    formData.append("issuing_authority", issuingAuthority.trim());
    formData.append("issue_date", issueDate);
    formData.append("expiry_date", expiryDate);
    formData.append("umdpc_certificate", umdpcFile);
    if (foreignFile) {
      formData.append("foreign_medical_qualification", foreignFile);
    }

    try {
      const response = await createPracticingLicense(formData);
      setModalState({
        open: true,
        type: "success",
        title: "License uploaded",
        message:
          "Your practicing license was saved successfully and your profile has been refreshed.",
      });
      resetForm();
      onSuccess?.(response);
    } catch (err: any) {
      const message =
        extractErrors(err) || "Failed to upload license. Please review the details and try again.";
      setModalState({
        open: true,
        type: "error",
        title: "License upload failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">License Number *</label>
        <Input
          type="text"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Issuing Authority *</label>
        <Input
          type="text"
          value={issuingAuthority}
          onChange={(e) => setIssuingAuthority(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Issue Date *</label>
        <Input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Expiry Date *</label>
        <Input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">UMDPC Certificate *</label>
        <Input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={(e) => setUmdpcFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Foreign Medical Qualification (optional)</label>
        <Input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={(e) => setForeignFile(e.target.files?.[0] || null)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Submit License"}
      </Button>

      <Dialog
        open={modalState.open}
        onOpenChange={(open) => setModalState((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {modalState.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <DialogTitle>{modalState.title}</DialogTitle>
            </div>
            <DialogDescription>{modalState.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() =>
                setModalState({ open: false, type: "success", title: "", message: "" })
              }
              type="button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
