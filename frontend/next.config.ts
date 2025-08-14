import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  // skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
};

export default nextConfig;
