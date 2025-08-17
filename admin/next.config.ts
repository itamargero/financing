import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['vtsayrgwwfsszykgudlc.supabase.co'],
    unoptimized: false,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
