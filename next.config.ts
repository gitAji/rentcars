import type { NextConfig } from "next";

console.log("next.config.ts - STRIPE_SECRET_KEY (during config load):", process.env.STRIPE_SECRET_KEY);
console.log("next.config.ts - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (during config load):", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mxgyrewfjubnndiqatnk.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
  
  /* config options here */
};

export default nextConfig;