/* @type {import('next').NextConfig} */
import type { NextConfig } from "next";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/images/M/**',
      },
      {
        protocol: 'https',
        hostname: 'cummoqflybmwtkrnfgzk.supabase.co',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
};

module.exports = nextConfig;
