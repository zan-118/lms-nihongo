import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: {
    position: 'top-right',
  },
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
