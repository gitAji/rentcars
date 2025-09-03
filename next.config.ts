import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // domains: ['example.com'], // Add external domains if you use them
  },
  /* config options here */
};

export default nextConfig;