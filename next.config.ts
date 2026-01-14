import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@mastra/*"],
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
