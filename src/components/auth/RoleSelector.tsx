/** @format */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
// import { User, Stethoscope, ShieldCheck, Check } from "lucide-react";
import { User, Stethoscope, Check } from "lucide-react";

const roles = [
  { id: "patient", label: "Patient", icon: User },
  { id: "doctor", label: "Doctor", icon: Stethoscope },
  // { id: "admin", label: "Admin", icon: ShieldCheck },
];

export function RoleSelector({
  onSelect,
  selected,
}: {
  onSelect: (role: string) => void;
  selected?: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {roles.map((role) => {
        // Safety check: ensure icon exists, fallback to User if undefined
        const Icon = role.icon || User;
        const isSelected = selected === role.id;

        return (
          <Card
            key={role.id}
            className={`relative p-4 cursor-pointer transition-all duration-200 ease-in-out outline-none group hover:shadow-md ${
              isSelected
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-sm"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
            onClick={() => onSelect(role.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(role.id);
              }
            }}
            tabIndex={0}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Select ${role.label} role`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 text-blue-600 animate-in fade-in zoom-in duration-200">
                <Check size={18} />
              </div>
            )}

            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className={`p-3 rounded-full transition-colors duration-200 ${
                  isSelected
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                }`}
              >
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <div
                  className={`font-semibold transition-colors ${
                    isSelected ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {role.label}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
