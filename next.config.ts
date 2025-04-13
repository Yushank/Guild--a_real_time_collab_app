import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: [
      "@next-auth/prisma-adapter",
      "@prisma/client"
    ],
  },
};

export default nextConfig;
