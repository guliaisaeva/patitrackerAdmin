/** @type {import('next').NextConfig} */
import { i18n } from "./next-i18next.config.mjs";

const nextConfig = {
  reactStrictMode: true,
  distDir: "build",

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "185.46.55.208",
      },
    ],
  },

  i18n,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
