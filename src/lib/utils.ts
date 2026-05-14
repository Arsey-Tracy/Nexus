import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a relative media path to a full URL pointing to the backend
 * @param mediaPath - The media path from the API (e.g., "/media/profile_pics/image.png")
 * @returns Full URL to the media file, or null if input is null/empty
 */
export function getMediaUrl(mediaPath: string | null | undefined): string | null {
  if (!mediaPath) return null;
  
  // If it's already a full URL, return as-is
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }
  
  // Get the API base URL and remove "/api" suffix if present
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "").replace(/\/api$/, "") ?? "http://localhost:8000";
  
  // Remove leading slash from mediaPath if present
  const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  
  return `${apiBase}${cleanPath}`;
}
