/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper module resolution
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default nextConfig;

