import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Disable the experimental font loading
        "*.woff2": ["raw"],
      },
    },
  },
};

export default config;
