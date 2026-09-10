// import type { NextConfig } from "next";

// const config: NextConfig = {
//   // Configuration options can be added here
// };

// export default config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
};

module.exports = nextConfig;

// Allow loading profile images served from the backend during development.
// This reads NEXT_PUBLIC_API_URL (if set) and whitelists common local hosts.
try {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const parsed = new URL(apiUrl);
  const apiHost = parsed.hostname;

  nextConfig.images = nextConfig.images || {};
  // Remote patterns for media paths (covers http/https and local hosts)
  nextConfig.images.remotePatterns = [
    { protocol: parsed.protocol.replace(":", ""), hostname: apiHost, pathname: "/media/**" },
    { protocol: "http", hostname: "127.0.0.1", pathname: "/media/**" },
    { protocol: "http", hostname: "localhost", pathname: "/media/**" },
    { protocol: "https", hostname: apiHost, pathname: "/media/**" },
  ];
} catch {
  // ignore - fallback to default behavior
}
