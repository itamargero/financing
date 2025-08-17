/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['vtsayrgwwfsszykgudlc.supabase.co'],
    unoptimized: false,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
}

export default nextConfig
