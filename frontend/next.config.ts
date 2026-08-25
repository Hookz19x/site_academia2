import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "192.168.1.244",
    "192.168.1.244:3000",
    "0.0.0.0",
    "0.0.0.0:3000",
  ],
};

export default nextConfig;

