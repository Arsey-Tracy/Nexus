/** @format */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";

const roles = [
  { id: "patient", label: "Patient", icon: "👤" },
  { id: "doctor", label: "Doctor", icon: "🩺" },
  // { id: "nurse", label: "Nurse", icon: "👩‍⚕️" },
  // { id: "admin", label: "Admin", icon: "🛡️" },
];

export function RoleSelector({
  onSelect,
  selected,
}: {
  onSelect: (role: string) => void;
  selected?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => (
        <Card
          key={role.id}
          className={`p-4 cursor-pointer border transition-colors ${
            selected === role.id
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => onSelect(role.id)}
          tabIndex={0}
          aria-pressed={selected === role.id}
        >
          <div className="text-2xl mb-2">{role.icon}</div>
          <div className="font-semibold">{role.label}</div>
        </Card>
      ))}
    </div>
  );
}
