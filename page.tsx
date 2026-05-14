/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  // Account,
  DoctorProfile,
  PatientProfile,
  PracticingLicense,
  getDoctorProfile,
  getPatientProfile,
  updateDoctorProfile,
  updatePatientProfile,
  createPracticingLicense,
} from "@/lib/api/profile";
import { getMediaUrl } from "@/lib/utils";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  User: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  ),
  Shield: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  ),
  Upload: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  ),
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
      />
    </svg>
  ),
  X: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  ),
  Calendar: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
      />
    </svg>
  ),
  Stethoscope: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  ),
  AlertCircle: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "profile" | "licenses";

// ─── License Form Modal ───────────────────────────────────────────────────────
function LicenseFormModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    license_number: "",
    issuing_authority: "",
    issue_date: "",
    expiry_date: "",
  });
  const [umdpcFile, setUmdpcFile] = useState<File | null>(null);
  const [foreignFile, setForeignFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const umdpcRef = useRef<HTMLInputElement | null>(null);
  const foreignRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (umdpcFile) fd.append("umdpc_certificate", umdpcFile);
      if (foreignFile) fd.append("foreign_medical_qualification", foreignFile);
      await createPracticingLicense(fd);
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create license");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,12,18,0.85)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--accent-muted)" }}
            >
              <Icon.Shield />
            </div>
            <div>
              <h2
                className="font-semibold text-base"
                style={{ color: "var(--text-primary)" }}
              >
                Add Practicing License
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Submit your medical credentials for verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Icon.X />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <Icon.AlertCircle />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="License Number" required>
              <input
                type="text"
                placeholder="e.g. UMDPC-12345"
                value={form.license_number}
                onChange={(e) =>
                  setForm((f) => ({ ...f, license_number: e.target.value }))
                }
                className="field-input"
              />
            </Field>
            <Field label="Issuing Authority" required>
              <input
                type="text"
                placeholder="e.g. UMDPC"
                value={form.issuing_authority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, issuing_authority: e.target.value }))
                }
                className="field-input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Issue Date">
              <input
                type="date"
                value={form.issue_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, issue_date: e.target.value }))
                }
                className="field-input"
              />
            </Field>
            <Field label="Expiry Date">
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiry_date: e.target.value }))
                }
                className="field-input"
              />
            </Field>
          </div>

          {/* File uploads */}
          <div className="space-y-3">
            <FileUploadArea
              label="UMDPC Certificate"
              hint="Uganda Medical and Dental Practitioners Council certificate"
              file={umdpcFile}
              inputRef={umdpcRef}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={setUmdpcFile}
            />
            <FileUploadArea
              label="Foreign Medical Qualification"
              hint="Upload if your qualification is from outside Uganda"
              file={foreignFile}
              inputRef={foreignRef}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={setForeignFile}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ color: "var(--text-muted)", background: "var(--surface)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading || !form.license_number || !form.issuing_authority
            }
            className="px-5 py-2 text-sm rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {loading ? <Spinner /> : <Icon.Check />}
            {loading ? "Submitting…" : "Submit License"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FileUploadAreaProps {
  label: string;
  hint: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  onChange: (f: File | null) => void;
}

function FileUploadArea({
  label,
  hint,
  file,
  inputRef,
  accept,
  onChange,
}: FileUploadAreaProps) {
  return (
    <div>
      <p
        className="text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors"
        style={{
          border: file
            ? "1.5px solid var(--accent)"
            : "1.5px dashed var(--border)",
          background: file ? "var(--accent-muted)" : "var(--surface)",
        }}
      >
        <Icon.Upload />
        <div className="flex-1 min-w-0">
          <p
            className="text-sm truncate"
            style={{ color: file ? "var(--accent)" : "var(--text-secondary)" }}
          >
            {file ? file.name : "Click to upload file"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {hint}
          </p>
        </div>
        {file && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="p-1 rounded-md"
            style={{ color: "var(--text-muted)" }}
          >
            <Icon.X />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
        {required && <span style={{ color: "var(--accent)" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

// ─── License Card ─────────────────────────────────────────────────────────────
function LicenseCard({ license }: { license: PracticingLicense }) {
  const isValid = license.is_active;
  const now = new Date();
  const expiry = license.expiry_date ? new Date(license.expiry_date) : null;
  const isExpired = expiry ? expiry < now : false;

  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: "var(--accent-muted)" }}
          >
            <Icon.Shield />
          </div>
          <div>
            <p
              className="font-semibold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {license.license_number ?? "—"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {license.issuing_authority ?? "Unknown Authority"}
            </p>
          </div>
        </div>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            background: isExpired
              ? "rgba(239,68,68,0.1)"
              : isValid
                ? "rgba(34,197,94,0.12)"
                : "rgba(234,179,8,0.12)",
            color: isExpired ? "#f87171" : isValid ? "#4ade80" : "#facc15",
          }}
        >
          {isExpired ? "Expired" : isValid ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div
          className="rounded-lg px-3 py-2"
          style={{ background: "var(--surface)" }}
        >
          <p style={{ color: "var(--text-muted)" }}>Issue Date</p>
          <p
            className="font-medium mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            {license.issue_date ?? "—"}
          </p>
        </div>
        <div
          className="rounded-lg px-3 py-2"
          style={{ background: "var(--surface)" }}
        >
          <p style={{ color: "var(--text-muted)" }}>Expiry Date</p>
          <p
            className="font-medium mt-0.5"
            style={{ color: isExpired ? "#f87171" : "var(--text-primary)" }}
          >
            {license.expiry_date ?? "—"}
          </p>
        </div>
      </div>

      {(license.umdpc_certificate || license.foreign_medical_qualification) && (
        <div className="flex gap-2 mt-3">
          {license.umdpc_certificate && (
            <a
              href={license.umdpc_certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2.5 py-1 rounded-lg transition-colors"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              UMDPC Cert ↗
            </a>
          )}
          {license.foreign_medical_qualification && (
            <a
              href={license.foreign_medical_qualification}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2.5 py-1 rounded-lg transition-colors"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              Foreign Qual ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-xl px-4 py-3 text-center"
      style={{ background: "var(--surface)" }}
    >
      <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({
  name,
  src,
  size = 80,
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  if (src)
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, var(--accent), var(--accent-alt))",
        fontSize: size / 3,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Verification Badge ───────────────────────────────────────────────────────
function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        background: verified ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
        color: verified ? "#4ade80" : "#facc15",
      }}
    >
      {verified ? (
        <>
          <Icon.Check /> Verified
        </>
      ) : (
        "Pending Verification"
      )}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<DoctorProfile | PatientProfile | null>(
    null,
  );
  const [userType, setUserType] = useState<
    "doctor" | "nurse" | "patient" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Try doctor profile first; fall back to patient
      const p = await getDoctorProfile();
      setProfile(p);
      setUserType(p.user.user_type as any);
      setEditForm(p as any);
    } catch {
      try {
        const p = await getPatientProfile();
        setProfile(p);
        setUserType("patient");
        setEditForm(p as any);
      } catch {
        /* handle gracefully */
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const isDoctor = userType === "doctor" || userType === "nurse";
  const doc = profile as DoctorProfile;
  const patient = profile as PatientProfile;
  const account = profile?.user;

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      if (isDoctor) await updateDoctorProfile(editForm as any);
      else await updatePatientProfile(editForm as any);
      await fetchProfile();
      setEditing(false);
    } catch {
      /* noop */
    } finally {
      setSaveLoading(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Icon.User /> },
    { id: "profile", label: "Edit Profile", icon: <Icon.Edit /> },
    ...(isDoctor
      ? [{ id: "licenses" as Tab, label: "Licenses", icon: <Icon.Shield /> }]
      : []),
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #0c0f18;
          --surface: #131720;
          --card: #161b27;
          --border: rgba(255,255,255,0.07);
          --accent: #3b82f6;
          --accent-alt: #8b5cf6;
          --accent-muted: rgba(59,130,246,0.12);
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted: #475569;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', 'Segoe UI', sans-serif; background: var(--bg); color: var(--text-primary); }
        .field-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: var(--surface);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input:focus { border-color: var(--accent); }
        textarea.field-input { resize: vertical; min-height: 80px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
      `}</style>

      {showLicenseModal && (
        <LicenseFormModal
          onClose={() => setShowLicenseModal(false)}
          onSuccess={fetchProfile}
        />
      )}

      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Top gradient bar */}
        <div
          style={{
            height: 3,
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-alt))",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header Card */}
          <div
            className="rounded-2xl p-6 mb-6 fade-up"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar
                name={`${account?.first_name} ${account?.last_name}`}
                src={getMediaUrl(account?.profile_pic) || undefined}
                size={80}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {account?.first_name} {account?.last_name}
                  </h1>
                  <VerifiedBadge verified={account?.is_verified ?? false} />
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  @{account?.username} · {account?.email}
                </p>
                <p
                  className="text-sm mt-1 capitalize font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  {account?.user_type}
                  {isDoctor && doc?.specialization
                    ? ` · ${doc.specialization}`
                    : ""}
                </p>
              </div>
              {isDoctor && (
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${doc?.is_available ? "text-green-400 bg-green-400/10" : "text-slate-400 bg-slate-400/10"}`}
                  >
                    {doc?.is_available ? "● Available" : "● Unavailable"}
                  </span>
                  {doc?.is_verified_by_umdpc && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium text-blue-400 bg-blue-400/10">
                      UMDPC Verified
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stats Row */}
            {isDoctor && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                <StatPill
                  label="Experience"
                  value={
                    doc?.years_of_experience
                      ? `${doc.years_of_experience}y`
                      : "—"
                  }
                />
                <StatPill
                  label="Licenses"
                  value={doc?.doctor_practicing_licenses?.length ?? 0}
                />
                <StatPill
                  label="Status"
                  value={doc?.is_specialist ? "Specialist" : "General"}
                />
              </div>
            )}
            {!isDoctor && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                <StatPill
                  label="Blood Type"
                  value={patient?.blood_type ?? "—"}
                />
                <StatPill
                  label="Emergency Contact"
                  value={patient?.emergency_contact ?? "—"}
                />
                <StatPill label="Account Type" value="Patient" />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-6"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? "var(--accent)" : "transparent",
                  color: tab === t.id ? "#fff" : "var(--text-muted)",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="fade-up" key={tab}>
            {/* ── Overview ── */}
            {tab === "overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard title="Contact Information">
                  <InfoRow label="Phone" value={account?.phone_number} />
                  <InfoRow label="Email" value={account?.email} />
                  <InfoRow
                    label="Date of Birth"
                    value={account?.date_of_birth}
                  />
                  <InfoRow
                    label="Member Since"
                    value={
                      account?.created_at
                        ? new Date(account.created_at).toLocaleDateString()
                        : undefined
                    }
                  />
                </InfoCard>

                {isDoctor ? (
                  <InfoCard title="Professional Details">
                    <InfoRow
                      label="Specialization"
                      value={doc?.specialization}
                    />
                    <InfoRow
                      label="Experience"
                      value={
                        doc?.years_of_experience
                          ? `${doc.years_of_experience} years`
                          : undefined
                      }
                    />
                    <InfoRow
                      label="Specialist"
                      value={doc?.is_specialist ? "Yes" : "No"}
                    />
                    <InfoRow
                      label="UMDPC Verified"
                      value={doc?.is_verified_by_umdpc ? "Yes" : "No"}
                    />
                  </InfoCard>
                ) : (
                  <InfoCard title="Medical Information">
                    <InfoRow label="Blood Type" value={patient?.blood_type} />
                    <InfoRow
                      label="Emergency Contact"
                      value={patient?.emergency_contact}
                    />
                    <InfoRow label="Allergies" value={patient?.allergies} />
                    <InfoRow
                      label="Chronic Conditions"
                      value={patient?.chronic_conditions}
                    />
                  </InfoCard>
                )}

                {isDoctor && doc?.biography && (
                  <div
                    className="sm:col-span-2 rounded-2xl p-5"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-3"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Biography
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {doc.biography}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Edit Profile ── */}
            {tab === "profile" && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Personal Information
                  </h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      style={{
                        background: "var(--accent-muted)",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon.Edit /> Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name">
                    <input
                      type="text"
                      className="field-input"
                      disabled={!editing}
                      value={editForm?.user?.first_name ?? ""}
                      onChange={(e) =>
                        setEditForm((f: any) => ({
                          ...f,
                          user: { ...f.user, first_name: e.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Last Name">
                    <input
                      type="text"
                      className="field-input"
                      disabled={!editing}
                      value={editForm?.user?.last_name ?? ""}
                      onChange={(e) =>
                        setEditForm((f: any) => ({
                          ...f,
                          user: { ...f.user, last_name: e.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Phone Number">
                    <input
                      type="tel"
                      className="field-input"
                      disabled={!editing}
                      value={editForm?.user?.phone_number ?? ""}
                      onChange={(e) =>
                        setEditForm((f: any) => ({
                          ...f,
                          user: { ...f.user, phone_number: e.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Date of Birth">
                    <input
                      type="date"
                      className="field-input"
                      disabled={!editing}
                      value={editForm?.user?.date_of_birth ?? ""}
                      onChange={(e) =>
                        setEditForm((f: any) => ({
                          ...f,
                          user: { ...f.user, date_of_birth: e.target.value },
                        }))
                      }
                    />
                  </Field>

                  {isDoctor ? (
                    <>
                      <Field label="Specialization">
                        <input
                          type="text"
                          className="field-input"
                          disabled={!editing}
                          value={editForm?.specialization ?? ""}
                          onChange={(e) =>
                            setEditForm((f: any) => ({
                              ...f,
                              specialization: e.target.value,
                            }))
                          }
                        />
                      </Field>
                      <Field label="Years of Experience">
                        <input
                          type="number"
                          className="field-input"
                          disabled={!editing}
                          value={editForm?.years_of_experience ?? ""}
                          onChange={(e) =>
                            setEditForm((f: any) => ({
                              ...f,
                              years_of_experience: Number(e.target.value),
                            }))
                          }
                        />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Biography">
                          <textarea
                            className="field-input"
                            disabled={!editing}
                            value={editForm?.biography ?? ""}
                            onChange={(e) =>
                              setEditForm((f: any) => ({
                                ...f,
                                biography: e.target.value,
                              }))
                            }
                          />
                        </Field>
                      </div>
                    </>
                  ) : (
                    <>
                      <Field label="Blood Type">
                        <input
                          type="text"
                          className="field-input"
                          disabled={!editing}
                          value={editForm?.blood_type ?? ""}
                          onChange={(e) =>
                            setEditForm((f: any) => ({
                              ...f,
                              blood_type: e.target.value,
                            }))
                          }
                        />
                      </Field>
                      <Field label="Emergency Contact">
                        <input
                          type="tel"
                          className="field-input"
                          disabled={!editing}
                          value={editForm?.emergency_contact ?? ""}
                          onChange={(e) =>
                            setEditForm((f: any) => ({
                              ...f,
                              emergency_contact: e.target.value,
                            }))
                          }
                        />
                      </Field>
                      <Field label="Allergies">
                        <textarea
                          className="field-input"
                          disabled={!editing}
                          value={editForm?.allergies ?? ""}
                          onChange={(e) =>
                            setEditForm((f: any) => ({
                              ...f,
                              allergies: e.target.value,
                            }))
                          }
                        />
                      </Field>
                      <Field label="Chronic Conditions">
                        <textarea
                          className="field-input"
                          disabled={!editing}
                          value={editForm?.chronic_conditions ?? ""}
                          onChange={(e) =>
                            setEditForm((f: any) => ({
                              ...f,
                              chronic_conditions: e.target.value,
                            }))
                          }
                        />
                      </Field>
                    </>
                  )}
                </div>

                {editing && (
                  <div
                    className="flex gap-3 mt-6 pt-5"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditForm(profile as any);
                      }}
                      className="px-4 py-2 text-sm rounded-lg"
                      style={{
                        background: "var(--surface)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-medium disabled:opacity-50"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      {saveLoading ? <Spinner /> : <Icon.Check />}
                      {saveLoading ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Licenses ── */}
            {tab === "licenses" && isDoctor && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Practicing Licenses
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {doc?.doctor_practicing_licenses?.length ?? 0} license
                      {(doc?.doctor_practicing_licenses?.length ?? 0) !== 1
                        ? "s"
                        : ""}{" "}
                      on file
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLicenseModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    <Icon.Plus /> Add License
                  </button>
                </div>

                {!doc?.doctor_practicing_licenses ||
                doc.doctor_practicing_licenses.length === 0 ? (
                  <div
                    className="rounded-2xl p-10 text-center"
                    style={{
                      background: "var(--card)",
                      border: "1.5px dashed var(--border)",
                    }}
                  >
                    <div
                      className="inline-flex p-4 rounded-2xl mb-4"
                      style={{ background: "var(--surface)" }}
                    >
                      <Icon.Shield />
                    </div>
                    <p
                      className="font-medium mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No licenses yet
                    </p>
                    <p
                      className="text-sm mb-4"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Add your first practicing license to get verified
                    </p>
                    <button
                      onClick={() => setShowLicenseModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      <Icon.Plus /> Add License
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doc.doctor_practicing_licenses.map((lic, i) => (
                      <LicenseCard key={i} license={lic} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p
        className="text-xs flex-shrink-0"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      <p
        className="text-xs text-right font-medium"
        style={{ color: value ? "var(--text-primary)" : "var(--text-muted)" }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

export default ProfilePage;
