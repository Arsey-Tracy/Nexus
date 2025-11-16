/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Robust frontend API utility for handling requests/responses.
 * - Generic typed helpers: get/post/put/patch/delete
 * - Automatic Authorization header from stored token (unless skipAuth)
 * - JSON/FormData support
 * - Timeout (abort) support
 * - Detailed APIError with parsed validation messages
 */

export class APIError extends Error {
  status: number;
  data: any;
  constructor(message: string, status = 0, data: any = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

// Config
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";
const DEFAULT_TIMEOUT = 30000; // ms

let authToken: string | null = null;

/**
 * Set auth token programmatically (optional).
 * Also stored in localStorage for persistence.
 */
export function setAuthToken(token: string | null) {
  authToken = token;
  try {
    if (token) localStorage.setItem("access", token);
    else {
      localStorage.removeItem("access");
      localStorage.removeItem("token");
    }
  } catch {}
}

/**
 * Try to initialize token from localStorage on import.
 */
try {
  const t = localStorage.getItem("access") || localStorage.getItem("token");
  if (t) authToken = t;
} catch {}

/**
 * Build query string from object
 */
function buildQuery(params?: Record<string, any>) {
  if (!params) return "";
  const parts: string[] = [];
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((val) => parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(val))}`));
    } else if (typeof v === "object") {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(v))}`);
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  });
  return parts.length ? `?${parts.join("&")}` : "";
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";
  if (res.status === 204) return null;
  if (contentType.includes("application/json")) {
    const data = await res.json();
    return data;
  }
  // fallback to text
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function timeoutPromise(ms: number, controller: AbortController) {
  return new Promise<never>((_resolve, reject) => {
    const id = setTimeout(() => {
      controller.abort();
      reject(new APIError("Request timeout", 0, null));
      clearTimeout(id);
    }, ms);
  });
}

async function request<T = any>(
  method: string,
  path: string,
  {
    body,
    params,
    headers,
    timeout = DEFAULT_TIMEOUT,
    rawBody = false,
    skipAuth = false, // new: skip adding Authorization header
    includeCredentials = false, // new: only include credentials when explicitly requested
  }: {
    body?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    rawBody?: boolean; // send body as-is (for FormData)
    skipAuth?: boolean;
    includeCredentials?: boolean;
  } = {}
): Promise<T> {
  const url = `${API_BASE}${path}${buildQuery(params)}`;

  const controller = new AbortController();
  const signal = controller.signal;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  // Add Authorization if available (authToken or localStorage) and not skipped
  if (!skipAuth) {
    if (!authToken) {
      try {
        const t = localStorage.getItem("access") || localStorage.getItem("token");
        if (t) authToken = t;
      } catch {}
    }
    if (authToken) finalHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
    signal,
  };

  // only include credentials when explicitly requested (prevents CSRF/session triggers)
  if (includeCredentials) {
    (fetchOptions as any).credentials = "include";
  }

  if (body !== undefined && body !== null) {
    if (rawBody) {
      // FormData or already prepared body
      fetchOptions.body = body;
      // Do not set content-type for FormData (browser will set it)
    } else if (body instanceof FormData) {
      fetchOptions.body = body;
    } else if (typeof body === "object") {
      finalHeaders["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    } else {
      finalHeaders["Content-Type"] = "text/plain";
      fetchOptions.body = String(body);
    }
  }

  // race fetch against timeout
  try {
    const res = await Promise.race([fetch(url, fetchOptions), timeoutPromise(timeout, controller)]) as Response;
    const parsed = await parseResponse(res);
    if (res.ok) {
      return parsed as T;
    }

    // parse errors: DRF returns object of field -> [messages]
    if (typeof parsed === "object" && parsed !== null) {
      throw new APIError("Request failed", res.status, parsed);
    } else {
      throw new APIError(parsed ?? "Request failed", res.status, parsed);
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new APIError("Request aborted", 0, null);
    }
    if (err instanceof APIError) throw err;
    // network or unexpected error
    throw new APIError(err?.message ?? "Network error", 0, null);
  }
}

/* Convenience helpers */
export const get = <T = any>(path: string, options?: { params?: Record<string, any>; headers?: Record<string, string>; timeout?: number; skipAuth?: boolean; includeCredentials?: boolean }) =>
  request<T>("GET", path, options);

export const post = <T = any>(path: string, body?: any, options?: { params?: Record<string, any>; headers?: Record<string, string>; timeout?: number; rawBody?: boolean; skipAuth?: boolean; includeCredentials?: boolean }) =>
  request<T>("POST", path, { ...options, body });

export const put = <T = any>(path: string, body?: any, options?: { params?: Record<string, any>; headers?: Record<string, string>; timeout?: number; rawBody?: boolean; skipAuth?: boolean; includeCredentials?: boolean }) =>
  request<T>("PUT", path, { ...options, body });

export const patch = <T = any>(path: string, body?: any, options?: { params?: Record<string, any>; headers?: Record<string, string>; timeout?: number; rawBody?: boolean; skipAuth?: boolean; includeCredentials?: boolean }) =>
  request<T>("PATCH", path, { ...options, body });

export const del = <T = any>(path: string, options?: { params?: Record<string, any>; headers?: Record<string, string>; timeout?: number; skipAuth?: boolean; includeCredentials?: boolean }) =>
  request<T>("DELETE", path, options);

/* File upload helper (returns parsed response) */
export async function upload<T = any>(path: string, files: Record<string, File | File[]>, data?: Record<string, any>, options?: { headers?: Record<string, string>; timeout?: number; skipAuth?: boolean; includeCredentials?: boolean }) {
  const form = new FormData();
  if (data) {
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (typeof v === "object" && !(v instanceof File)) {
        form.append(k, JSON.stringify(v));
      } else {
        form.append(k, String(v));
      }
    });
  }
  Object.entries(files).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((f) => form.append(key, f));
    } else {
      form.append(key, value);
    }
  });

  return request<T>("POST", path, { body: form, rawBody: true, headers: options?.headers, timeout: options?.timeout, skipAuth: options?.skipAuth, includeCredentials: options?.includeCredentials });
}

/* Helper to extract readable validation messages from APIError.data (DRF style) */
export function extractErrors(err: any): string {
  if (!err) return "Unknown error";
  if (err instanceof APIError && err.data) {
    const d = err.data;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) return d.join(", ");
    if (typeof d === "object") {
      return Object.entries(d)
        .map(([k, v]) => {
          if (Array.isArray(v)) return `${k}: ${v.join(", ")}`;
          if (typeof v === "object") return `${k}: ${JSON.stringify(v)}`;
          return `${k}: ${v}`;
        })
        .join(" | ");
    }
    return String(d);
  }
  if (err.message) return err.message;
  return String(err);
}