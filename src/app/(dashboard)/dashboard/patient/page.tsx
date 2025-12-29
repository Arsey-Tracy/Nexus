/** @format */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
import {
  // requestConsultation,
  Consultation,
  // createReview,
  getMyConsultations,
} from "@/lib/api/consultations";
import { BedsideNursing, getMyBedsideNursing } from "@/lib/api/bedside_nursing";
// import { Video, Home, X, Calendar, Clock } from "lucide-react";
import { Video, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewModal from "../../../../components/ReviewModal";
import ConsultationModal from "../../../../components/ConsultationModal";
import BedsideNursingModal from "../../../../components/BedsideNursingModal";
// Add these status color mappings
const statusColors = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  assigned: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  approved: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

// function ConsultationModal({
//   onClose,
//   onSuccess,
// }: {
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   const [step, setStep] = useState(1);
//   const [consultationType, setConsultationType] = useState<
//     "virtual" | "bedside" | null
//   >(null);
//   const [symptoms, setSymptoms] = useState("");
//   const [notes, setNotes] = useState("");
//   const [preferredDate, setPreferredDate] = useState("");
//   const [preferredTime, setPreferredTime] = useState("");
//   const [address, setAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleTypeSelection = (type: "virtual" | "bedside") => {
//     setConsultationType(type);
//     setStep(2);
//   };

//   const handleContinueToPayment = () => {
//     if (!symptoms) {
//       setError("Please describe your symptoms.");
//       return;
//     }
//     if (consultationType === "bedside" && !address) {
//       setError("Please provide your address for bedside service.");
//       return;
//     }
//     setError(null);
//     setStep(3);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const consultationNotes = `
//             ${notes}
//             Type: ${consultationType}
//             ${preferredDate ? `Preferred Date: ${preferredDate}` : ""}
//             ${preferredTime ? `Preferred Time: ${preferredTime}` : ""}
//             ${address ? `Address: ${address}` : ""}`.trim();

//       const response = await requestConsultation(
//         symptoms,
//         consultationNotes,
//         consultationType as "virtual" | "bedside"
//       );
//       console.log("Consultation request response:", response);

//       // Handle both response types:
//       // 1. Direct Consultation object
//       // 2. ConsultationRequestResponse with consultation + payment_link
//       if (response) {
//         // If there's a payment_link, redirect to payment
//         if (response.payment_link) {
//           window.location.href = response.payment_link;
//         } else {
//           // Otherwise, show success and refresh
//           alert(
//             "Consultation request submitted successfully! You will be contacted shortly."
//           );
//           onSuccess();
//         }
//       }
//     } catch (_err: unknown) {
//       // FIX: Changed 'any' to 'unknown'
//       // log for diagnostics
//       console.error("Consultation submission error:", _err);

//       // Extract detailed error message from backend validation errors
//       let errorMessage = "Failed to submit request. Please try again.";
//       // Use type assertion to safey access expected properties for error handling
//       const err = _err as { data?: unknown };
//       if (err?.data) {
//         // Handle Django REST Framework validation errors
//         if (typeof err.data === "object") {
//           const errors: string[] = [];
//           Object.entries(err.data).forEach(
//             ([field, messages]: [string, unknown]) => {
//               if (Array.isArray(messages)) {
//                 errors.push(`${field}: ${messages.join(", ")}`);
//               } else if (typeof messages === "string") {
//                 errors.push(`${field}: ${messages}`);
//               }
//             }
//           );
//           if (errors.length > 0) {
//             errorMessage = errors.join("\n");
//           }
//         } else if (typeof err.data === "string") {
//           errorMessage = err.data;
//         }
//       }
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setStep(1);
//     setConsultationType(null);
//     setSymptoms("");
//     setNotes("");
//     setPreferredDate("");
//     setPreferredTime("");
//     setAddress("");
//     setError(null);
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-semibold text-white">
//               Book Your Consultation
//             </h2>
//             <p className="text-blue-100 text-sm mt-1">
//               Quick and easy scheduling
//             </p>
//           </div>
//           <Button
//             type="button"
//             onClick={() => {
//               resetForm();
//               onClose();
//             }}
//             className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
//             aria-label="Close modal"
//           >
//             <X className="w-5 h-5" />
//           </Button>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           <div className="p-6 md:p-8">
//             {/* Step Indicator */}
//             <div className="flex items-center justify-center mb-10">
//               <div className="flex items-center w-full max-w-md">
//                 {/* Step 1 */}
//                 <div className="flex flex-col items-center flex-1">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                       step >= 1
//                         ? "bg-blue-600 text-white shadow-md"
//                         : "bg-gray-200 text-gray-500"
//                     }`}
//                   >
//                     {step > 1 ? "✓" : "1"}
//                   </div>
//                   <span className="text-xs mt-2 text-gray-600 font-medium">
//                     Select Type
//                   </span>
//                 </div>

//                 {/* Connector */}
//                 <div
//                   className={`h-1 flex-1 mx-2 rounded transition-all ${
//                     step >= 2 ? "bg-blue-600" : "bg-gray-200"
//                   }`}
//                 />

//                 {/* Step 2 */}
//                 <div className="flex flex-col items-center flex-1">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                       step >= 2
//                         ? "bg-blue-600 text-white shadow-md"
//                         : "bg-gray-200 text-gray-500"
//                     }`}
//                   >
//                     {step > 2 ? "✓" : "2"}
//                   </div>
//                   <span className="text-xs mt-2 text-gray-600 font-medium">
//                     Details
//                   </span>
//                 </div>

//                 {/* Connector */}
//                 <div
//                   className={`h-1 flex-1 mx-2 rounded transition-all ${
//                     step >= 3 ? "bg-blue-600" : "bg-gray-200"
//                   }`}
//                 />

//                 {/* Step 3 */}
//                 <div className="flex flex-col items-center flex-1">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                       step >= 3
//                         ? "bg-blue-600 text-white shadow-md"
//                         : "bg-gray-200 text-gray-500"
//                     }`}
//                   >
//                     3
//                   </div>
//                   <span className="text-xs mt-2 text-gray-600 font-medium">
//                     Payment
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Step 1: Choose Type */}
//             {step === 1 && (
//               <div className="space-y-6">
//                 <div className="text-center mb-8">
//                   <h3 className="text-2xl font-semibold text-gray-800 mb-2">
//                     Choose Your Consultation Type
//                   </h3>
//                   <p className="text-gray-600">
//                     Select the option that works best for you
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   {/* Virtual Consultation Card */}
//                   <button
//                     type="button"
//                     onClick={() => handleTypeSelection("virtual")}
//                     className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     <div className="flex flex-col h-full">
//                       <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
//                         <Video className="w-7 h-7 text-blue-600" />
//                       </div>
//                       <h4 className="font-semibold text-lg mb-2 text-gray-800">
//                         Virtual Consultation
//                       </h4>
//                       <p className="text-sm text-gray-600 mb-4 flex-grow">
//                         Connect with a doctor via secure video call from
//                         anywhere
//                       </p>
//                       <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                         <span className="text-blue-600 font-bold text-xl">
//                           UGX 50,000
//                         </span>
//                         <span className="text-xs text-gray-500">~30 mins</span>
//                       </div>
//                     </div>
//                   </button>

//                   {/* Bedside Service Card */}
//                   <button
//                     type="button"
//                     onClick={() => handleTypeSelection("bedside")}
//                     className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     <div className="flex flex-col h-full">
//                       <div className="bg-green-50 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
//                         <Home className="w-7 h-7 text-green-600" />
//                       </div>
//                       <h4 className="font-semibold text-lg mb-2 text-gray-800">
//                         Bedside Service
//                       </h4>
//                       <p className="text-sm text-gray-600 mb-4 flex-grow">
//                         A qualified doctor visits you at your preferred location
//                       </p>
//                       <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                         <span className="text-green-600 font-bold text-xl">
//                           UGX 70,000
//                         </span>
//                         <span className="text-xs text-gray-500">~45 mins</span>
//                       </div>
//                     </div>
//                   </button>
//                 </div>

//                 <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
//                   <div className="flex items-start gap-3">
//                     <div className="bg-blue-100 rounded-full p-1 mt-0.5">
//                       <svg
//                         className="w-4 h-4 text-blue-600"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <p className="text-sm text-blue-800">
//                       All consultations are conducted by licensed medical
//                       professionals. Your privacy and health information are
//                       protected.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Details */}
//             {step === 2 && (
//               <div className="space-y-6">
//                 {/* Selected Type Badge */}
//                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       {consultationType === "virtual" ? (
//                         <Video className="w-5 h-5 text-blue-600" />
//                       ) : (
//                         <Home className="w-5 h-5 text-green-600" />
//                       )}
//                       <span className="font-semibold text-gray-800">
//                         {consultationType === "virtual"
//                           ? "Virtual Consultation"
//                           : "Bedside Service"}
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setStep(1)}
//                       className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                     >
//                       Change
//                     </button>
//                   </div>
//                 </div>

//                 {/* Symptoms Field */}
//                 <div>
//                   <label
//                     htmlFor="symptoms"
//                     className="block text-sm font-semibold text-gray-700 mb-2"
//                   >
//                     What symptoms are you experiencing?{" "}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <Textarea
//                     id="symptoms"
//                     value={symptoms}
//                     onChange={(e) => setSymptoms(e.target.value)}
//                     placeholder="Please describe your symptoms in detail (e.g., persistent headache, fever for 3 days, difficulty breathing)"
//                     rows={4}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Be as specific as possible to help the doctor prepare
//                   </p>
//                 </div>

//                 {/* Date and Time */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label
//                       htmlFor="preferredDate"
//                       className="block text-sm font-semibold text-gray-700 mb-2"
//                     >
//                       <Calendar className="w-4 h-4 inline mr-1" />
//                       Preferred Date
//                     </label>
//                     <Input
//                       type="date"
//                       id="preferredDate"
//                       value={preferredDate}
//                       onChange={(e) => setPreferredDate(e.target.value)}
//                       min={new Date().toISOString().split("T")[0]}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="preferredTime"
//                       className="block text-sm font-semibold text-gray-700 mb-2"
//                     >
//                       <Clock className="w-4 h-4 inline mr-1" />
//                       Preferred Time
//                     </label>
//                     <Input
//                       type="time"
//                       id="preferredTime"
//                       value={preferredTime}
//                       onChange={(e) => setPreferredTime(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 {/* Address for Bedside */}
//                 {consultationType === "bedside" && (
//                   <div>
//                     <label
//                       htmlFor="address"
//                       className="block text-sm font-semibold text-gray-700 mb-2"
//                     >
//                       Your Address <span className="text-red-500">*</span>
//                     </label>
//                     <Textarea
//                       id="address"
//                       value={address}
//                       onChange={(e) => setAddress(e.target.value)}
//                       placeholder="Enter your complete address including building/house number, street name, landmarks, and area"
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                     />
//                   </div>
//                 )}

//                 {/* Additional Notes */}
//                 <div>
//                   <label
//                     htmlFor="notes"
//                     className="block text-sm font-semibold text-gray-700 mb-2"
//                   >
//                     Additional Information{" "}
//                     <span className="text-gray-400 font-normal">
//                       (optional)
//                     </span>
//                   </label>
//                   <Textarea
//                     id="notes"
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     placeholder="Any allergies, current medications, or other relevant medical history"
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   />
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//                     <div className="flex items-center gap-2">
//                       <svg
//                         className="w-5 h-5 text-red-500"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <p className="text-sm text-red-700 font-medium">
//                         {error}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex justify-between pt-4 gap-3">
//                   <Button
//                     type="button"
//                     onClick={() => setStep(1)}
//                     className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
//                   >
//                     Back
//                   </Button>
//                   <Button
//                     type="button"
//                     onClick={handleContinueToPayment}
//                     className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
//                   >
//                     Continue to Payment →
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Payment */}
//             {step === 3 && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-semibold text-gray-800 mb-2">
//                     Review & Confirm
//                   </h3>
//                   <p className="text-gray-600">
//                     Please verify your booking details
//                   </p>
//                 </div>

//                 {/* Summary Card */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 space-y-4">
//                   <div className="flex items-start justify-between pb-4 border-b border-gray-200">
//                     <div className="flex items-center gap-3">
//                       {consultationType === "virtual" ? (
//                         <div className="bg-blue-100 p-2 rounded-lg">
//                           <Video className="w-5 h-5 text-blue-600" />
//                         </div>
//                       ) : (
//                         <div className="bg-green-100 p-2 rounded-lg">
//                           <Home className="w-5 h-5 text-green-600" />
//                         </div>
//                       )}
//                       <div>
//                         <p className="text-sm text-gray-600 font-medium">
//                           Consultation Type
//                         </p>
//                         <p className="font-semibold text-gray-800 capitalize">
//                           {consultationType?.replace("_", " ")}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {preferredDate && preferredTime && (
//                     <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
//                       <div className="bg-blue-100 p-2 rounded-lg">
//                         <Calendar className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-600 font-medium">
//                           Scheduled For
//                         </p>
//                         <p className="font-semibold text-gray-800">
//                           {new Date(preferredDate).toLocaleDateString("en-US", {
//                             weekday: "long",
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           })}
//                         </p>
//                         <p className="text-sm text-gray-600">{preferredTime}</p>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between pt-4 bg-blue-50 -mx-6 px-6 py-4 rounded-b-xl">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium">
//                         Total Amount
//                       </p>
//                       <p className="text-3xl font-bold text-blue-600">
//                         UGX{" "}
//                         {consultationType === "virtual" ? "50,000" : "70,000"}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-500">Secure payment</p>
//                       <div className="flex gap-1 mt-1">
//                         <div className="w-6 h-4 bg-gray-300 rounded"></div>
//                         <div className="w-6 h-4 bg-gray-300 rounded"></div>
//                         <div className="w-6 h-4 bg-gray-300 rounded"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Info */}
//                 <div className="p-4 bg-green-50 rounded-lg border border-green-100">
//                   <div className="flex items-start gap-3">
//                     <svg
//                       className="w-5 h-5 text-green-600 mt-0.5"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-semibold text-green-800">
//                         Secure Payment Processing
//                       </p>
//                       <p className="text-xs text-green-700 mt-1">
//                         Your payment information is encrypted and protected
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//                     <div className="flex items-center gap-2">
//                       <svg
//                         className="w-5 h-5 text-red-500"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <p className="text-sm text-red-700 font-medium">
//                         {error}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex justify-between pt-4 gap-3">
//                   <Button
//                     type="button"
//                     onClick={() => setStep(2)}
//                     className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
//                   >
//                     Back
//                   </Button>
//                   <Button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     {loading ? (
//                       <span className="flex items-center gap-2">
//                         <svg
//                           className="animate-spin h-5 w-5"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                             fill="none"
//                           />
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           />
//                         </svg>
//                         Processing...
//                       </span>
//                     ) : (
//                       "Confirm & Pay"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// Review model goes here
export default function PatientDashboard() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [bedsideNursing, setBedsideNursing] = useState<BedsideNursing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingConsultation, setReviewingConsultation] =
    useState<Consultation | null>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showBedsideNursingModal, setShowBedsideNursingModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [consultationsData, bedsideNursingData] = await Promise.all([
        getMyConsultations(),
        getMyBedsideNursing(),
      ]);
      setConsultations(consultationsData);
      setBedsideNursing(bedsideNursingData);
      setError(null);
    } catch (_err) {
      console.error("Failed to fetch data:", _err);
      // Show mock data when API fails
      setConsultations([
        {
          id: 1,
          patient: {
            id: 1,
            first_name: user?.first_name || "Patient",
            last_name: user?.last_name || "User",
            phone_number: "",
          },
          doctor: { id: 1, first_name: "Smith", last_name: "Dr." },
          symptoms: "Regular checkup",
          status: "completed" as const,
          requested_at: new Date().toISOString(),
          scheduled_time: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
      ]);
      setBedsideNursing([]);
      setError("Backend is currently unavailable. Showing sample data.");
    } finally {
      setLoading(false);
    }
  }, [user?.first_name, user?.last_name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBookingSuccess = () => {
    setShowConsultationModal(false);
    setShowBedsideNursingModal(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 space-y-8"
    >
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-gray-900"
        >
          Welcome back, {user?.first_name}
        </motion.h1>
        <p className="text-gray-600 mt-2">
          Manage your health consultations and appointments
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div className="app-card p-0">
            <Card className="rounded-none border-0">
              <CardContent className="p-6">
                <Button
                  onClick={() => setShowConsultationModal(true)}
                  className="w-full h-auto py-8 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  size="lg"
                >
                  <Video className="w-8 h-8 mr-3" />
                  <div>
                    <div className="font-bold">Virtual Consultation</div>
                    <div className="text-sm opacity-90">From UGX 50,000</div>
                  </div>
                </Button>
                <p className="text-sm text-center text-gray-600 mt-4">
                  Connect with a healthcare professional from anywhere
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div className="app-card p-0">
            <Card className="rounded-none border-0">
              <CardContent className="p-6">
                <Button
                  onClick={() => setShowBedsideNursingModal(true)}
                  className="w-full h-auto py-8 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  size="lg"
                >
                  <Home className="w-8 h-8 mr-3" />
                  <div>
                    <div className="font-bold">Home Visit</div>
                    <div className="text-sm opacity-90">From UGX 70,000</div>
                  </div>
                </Button>
                <p className="text-sm text-center text-gray-600 mt-4">
                  Get medical care in the comfort of your home
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Consultation History */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Medical History</CardTitle>
              <CardDescription>
                Track your consultations and bedside nursing services
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowConsultationModal(true)}
                variant="outline"
                size="sm"
              >
                <Video className="w-4 h-4 mr-2" />
                Book Consultation
              </Button>
              <Button
                onClick={() => setShowBedsideNursingModal(true)}
                variant="outline"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Book Home Visit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" onClick={fetchData} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : consultations.length > 0 || bedsideNursing.length > 0 ? (
              <div className="space-y-6">
                {/* Consultations Section */}
                {consultations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Virtual Consultations
                    </h3>
                    <div className="space-y-4">
                      {consultations.map((c) => (
                        <motion.div
                          key={`consultation-${c.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="hover:shadow-md transition-all">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Badge
                                      variant="secondary"
                                      className={`${
                                        statusColors[c.status]?.bg
                                      } ${statusColors[c.status]?.text}`}
                                    >
                                      {c.status.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                      {new Date(
                                        c.requested_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {c.doctor && (
                                    <h3 className="text-lg font-semibold mb-2">
                                      Dr. {c.doctor.first_name}{" "}
                                      {c.doctor.last_name}
                                    </h3>
                                  )}
                                  <p className="text-gray-600">{c.symptoms}</p>
                                </div>
                                <div className="flex flex-row md:flex-col gap-3 justify-end">
                                  {c.status === "assigned" &&
                                    c.meeting_link && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button asChild className="w-full">
                                              <a
                                                href={c.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <Video className="w-4 h-4 mr-2" />
                                                Join Call
                                              </a>
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Start your virtual consultation
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  {c.status === "completed" && (
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setReviewingConsultation(c)
                                      }
                                      className="w-full"
                                    >
                                      Leave Review
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bedside Nursing Section */}
                {bedsideNursing.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Bedside Nursing
                    </h3>
                    <div className="space-y-4">
                      {bedsideNursing.map((b) => (
                        <motion.div
                          key={`bedside-${b.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="hover:shadow-md transition-all">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Badge
                                      variant="secondary"
                                      className={`${
                                        statusColors[b.status]?.bg
                                      } ${statusColors[b.status]?.text}`}
                                    >
                                      {b.status.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                      {new Date(
                                        b.requested_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {b.doctor && (
                                    <h3 className="text-lg font-semibold mb-2">
                                      Dr. {b.doctor.first_name}{" "}
                                      {b.doctor.last_name}
                                    </h3>
                                  )}
                                  <p className="text-gray-600 mb-2">
                                    {b.symptoms}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {b.address}
                                  </p>
                                </div>
                                <div className="flex flex-row md:flex-col gap-3 justify-end">
                                  {b.status === "completed" && (
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      View Details
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Medical History Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Book your first consultation or home visit to get started
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setShowConsultationModal(true)}>
                    <Video className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                  <Button
                    onClick={() => setShowBedsideNursingModal(true)}
                    variant="outline"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Book Home Visit
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modals */}
      {showConsultationModal && (
        <ConsultationModal
          onClose={() => setShowConsultationModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showBedsideNursingModal && (
        <BedsideNursingModal
          onClose={() => setShowBedsideNursingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {reviewingConsultation && (
        <ReviewModal
          consultation={reviewingConsultation}
          onClose={() => setReviewingConsultation(null)}
          onReviewed={() => {
            setReviewingConsultation(null);
            fetchData();
          }}
        />
      )}
    </motion.div>
  );
}
