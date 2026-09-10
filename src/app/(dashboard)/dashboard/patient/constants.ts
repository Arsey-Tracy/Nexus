/**
 * @format
 * Patient Dashboard Constants
 * Centralized configuration for status styling and animations
 */

export const statusConfig = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  assigned: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-400",
  },
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  completed: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  cancelled: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    dot: "bg-rose-400",
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.05, duration: 0.3 },
  }),
};
