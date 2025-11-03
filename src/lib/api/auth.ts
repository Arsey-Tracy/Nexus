/** @format */

// Import the 'post' helper from your existing, robust API client
import { post, get } from "./api";

// The API_URL is already handled by your api.ts file, so we don't need it here.

// For auth endpoints we explicitly skip sending credentials and skip adding Authorization header
export const registerUser = (data: {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  user_type: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}) => {
  // Use skipAuth and ensure credentials are NOT included to avoid CSRF/session checks
  return post("/auth/register/", data, { skipAuth: true, includeCredentials: false });
};

export const loginUser = (data: { email: string; password: string }) => {
  return post("/auth/login/", data, { skipAuth: true, includeCredentials: false });
};

// Simplified getCurrentUser (protected) — keep auth
export const getCurrentUser = () => {
  return get("/me/");
};
