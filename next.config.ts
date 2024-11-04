import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'export',
  distDir: 'build',
  assetPrefix: './staticfiles',
};

export default nextConfig;
