/** @format */

import { useState } from "react";
import { createPracticingLicense } from "@/lib/api/profile";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { Form } from "./ui/form";

export default function LicenseUploadForm() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [umdpcFile, setUmdpcFile] = useState<File | null>(null);
  const [foreignFile, setForeignFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (
      !licenseNumber ||
      !issuingAuthority ||
      !issueDate ||
      !expiryDate ||
      !umdpcFile
    ) {
      setError("Please fill all required fields and uplaod UMDPC certificate.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("license_number", licenseNumber);
    formData.append("issuing_authority", issuingAuthority);
    formData.append("issue_date", issueDate);
    formData.append("expiry_date", expiryDate);
    formData.append("umdpc_certificate", umdpcFile);
    if (foreignFile) {
      formData.append("foreign_medical_qualification", foreignFile);
    }

    // is_active defaults to true on backend, you can  add if needed

    try {
      const response = await createPracticingLicense(formData);
      console.log("License created:", response);
    } catch (err: any) {
      setError(err.message || "Failed to upload license");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>License Number</label>
        <Input
          type="text"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Issuing Authority *</label>
        <Input
          type="text"
          value={issuingAuthority}
          onChange={(e) => setIssuingAuthority(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Issue Date *</label>
        <Input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Expiry Date *</label>
        <Input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>UMDPC Certificate *</label>
        <Input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={(e) => setUmdpcFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      <div>
        <label>Foreign Medical Qualification (optional)</label>
        <Input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={(e) => setForeignFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      {error && <p className="text-red-700">{error}</p>}
      <Button>{loading ? "Uploading..." : "Submit License"}</Button>
    </form>
  );
}
