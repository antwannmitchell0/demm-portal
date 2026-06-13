/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external sources if needed
  images: {
    remotePatterns: [],
  },
  // Ensure env vars are available
  env: {
    NEXT_PUBLIC_DEMM_API_URL: process.env.NEXT_PUBLIC_DEMM_API_URL,
  },
};

export default nextConfig;
