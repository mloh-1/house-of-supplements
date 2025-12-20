import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Fix for @libsql/client bundling issues with Next.js
  serverExternalPackages: [
    "@libsql/client",
    "@prisma/adapter-libsql",
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore README.md, LICENSE, and other non-JS files from libsql packages
      config.module.rules.push({
        test: /\.md$/,
        use: "ignore-loader",
      });
    }
    return config;
  },
};

export default nextConfig;
