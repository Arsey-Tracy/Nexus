import { Config } from "next";

const config: Config = {
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
