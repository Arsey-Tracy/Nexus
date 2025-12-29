/** @format */

// /** @format */

// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowLeft, Sparkles } from "lucide-react";

// interface AuthLayoutProps {
//   children: React.ReactNode;
//   image?: string;
//   title: string;
//   subtitle?: string;
// }

// export function AuthLayout({
//   children,
//   image = "/auth-bg.jpg",
//   title,
//   subtitle,
// }: AuthLayoutProps) {
//   return (
//     <main className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
//       {/* Auth Form Section */}
//       <div className="flex flex-1 flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative">
//         {/* Subtle background pattern */}
//         <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

//         <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-8 relative z-10">
//           {/* Logo and Back Button */}
//           <div className="flex flex-col space-y-6">
//             {/* Mobile Logo with improved styling */}
//             <div className="lg:hidden">
//               <Link
//                 href="/"
//                 className="inline-flex items-center gap-2.5 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors group"
//               >
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-blue-100 rounded-lg blur-sm group-hover:bg-blue-200 transition-colors" />
//                   <ArrowLeft className="relative h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
//                 </div>
//                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600">
//                   NexusCareUG
//                 </span>
//               </Link>
//             </div>

//             {/* Title Section with animation */}
//             <div className="flex flex-col space-y-3 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
//               <div className="flex items-center justify-center gap-2 mb-1">
//                 <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
//                 <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
//                   {title}
//                 </h1>
//               </div>
//               {subtitle && (
//                 <p className="text-base text-gray-600 font-medium max-w-sm mx-auto">
//                   {subtitle}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Form Content with card styling */}
//           <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
//             <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100/50 p-1">
//               <div className="bg-white rounded-xl p-6 sm:p-8">
//                 {children}
//               </div>
//             </div>
//           </div>

//           {/* Trust indicators */}
//           <div className="flex items-center justify-center gap-6 text-xs text-gray-500 animate-in fade-in duration-700 delay-300">
//             <div className="flex items-center gap-1.5">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//               <span>Secure</span>
//             </div>
//             <div className="w-px h-4 bg-gray-300" />
//             <div className="flex items-center gap-1.5">
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
//               <span>HIPAA Compliant</span>
//             </div>
//             <div className="w-px h-4 bg-gray-300" />
//             <div className="flex items-center gap-1.5">
//               <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
//               <span>Encrypted</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Branding & Image Section - Enhanced for desktop */}
//       <aside className="relative hidden lg:flex flex-1 h-screen flex-col overflow-hidden">
//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 z-10" />

//         {/* Background image with overlay */}
//         <div className="absolute inset-0 z-0">
//           <Image
//             src={image}
//             alt="Healthcare professionals"
//             fill
//             className="object-cover opacity-20 mix-blend-overlay"
//             priority
//           />
//         </div>

//         {/* Animated background elements */}
//         <div className="absolute inset-0 z-5">
//           <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
//         </div>

//         {/* Content */}
//         <div className="relative z-20 flex flex-col h-full p-12">
//           {/* Logo and back button */}
//           <Link
//             href="/"
//             className="flex items-center gap-3 text-lg font-semibold text-white hover:text-blue-100 transition-colors group mb-auto"
//           >
//             <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg group-hover:bg-white/20 transition-all">
//               <ArrowLeft className="h-5 w-5" />
//             </div>
//             <span className="text-xl">Nexus Healthcare</span>
//           </Link>

//           {/* Center content */}
//           <div className="flex-1 flex items-center justify-center">
//             <div className="max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
//               {/* Main quote */}
//               <blockquote className="space-y-6">
//                 <div className="relative">
//                   <div className="absolute -top-6 -left-4 text-8xl text-white/10 font-serif">"</div>
//                   <p className="text-2xl sm:text-3xl font-semibold text-white leading-relaxed relative">
//                     Connecting patients with healthcare professionals for better, more accessible care.
//                   </p>
//                 </div>
//               </blockquote>

//               {/* Stats/Features */}
//               <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-white mb-1">24/7</div>
//                   <div className="text-sm text-blue-100">Available</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-white mb-1">500+</div>
//                   <div className="text-sm text-blue-100">Doctors</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-white mb-1">50K+</div>
//                   <div className="text-sm text-blue-100">Patients</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-auto">
//             <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
//               <div>
//                 <p className="text-sm font-semibold text-white">Uganda's Leading Telemedicine Platform</p>
//                 <p className="text-xs text-blue-200 mt-1">Trusted by thousands nationwide</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
//                   <Sparkles className="h-5 w-5 text-blue-200" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </aside>

//       <style jsx>{`
//         @keyframes grid {
//           0% {
//             background-position: 0 0;
//           }
//           100% {
//             background-position: 50px 50px;
//           }
//         }
//         .bg-grid-pattern {
//           background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
//           background-size: 50px 50px;
//           animation: grid 20s linear infinite;
//         }
//       `}</style>
//     </main>
//   );
// }
