import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  },
};

export default nextConfig;