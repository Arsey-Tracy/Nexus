/**
 * @format
 * QuickActionCards Component
 * Displays quick action buttons for booking consultations and home visits
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video, Home } from "lucide-react";
import { itemVariants } from "../constants";

interface QuickActionCardsProps {
  onConsultationClick: () => void;
  onHomeVisitClick: () => void;
}

export function QuickActionCards({
  onConsultationClick,
  onHomeVisitClick,
}: QuickActionCardsProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Virtual Consultation */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onConsultationClick}
        className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-sky-500 to-blue-600 p-6 text-left shadow-md shadow-blue-200 transition-shadow hover:shadow-lg hover:shadow-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
        <div className="absolute -right-8 -bottom-6 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Video className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">
              Virtual Consultation
            </p>
            <p className="text-sm text-blue-100 mt-0.5">
              Connect with a doctor — from UGX 50,000
            </p>
          </div>
        </div>
      </motion.button>

      {/* Home Visit */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onHomeVisitClick}
        className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 to-emerald-600 p-6 text-left shadow-md shadow-teal-200 transition-shadow hover:shadow-lg hover:shadow-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
        <div className="absolute -right-8 -bottom-6 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Home className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">Home Visit</p>
            <p className="text-sm text-teal-100 mt-0.5">
              Care at your doorstep — from UGX 70,000
            </p>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
