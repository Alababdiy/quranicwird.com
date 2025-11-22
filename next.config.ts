import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "out",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ["!quran/**/*", "!logos/**/*"],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);
