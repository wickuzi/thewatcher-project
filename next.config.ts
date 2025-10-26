// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.mercuriojoyeros.com",
      },
      {
        protocol: "https",
        hostname: "fossil.scene7.com"
      },
      {
        protocol: "https",
        hostname: "shop.diesel.com"
      },
      {
        protocol: "https",
        hostname: "tse3.mm.bing.net"
      },
      {
        protocol: "https",
        hostname: "www.elpalaciodehierro.com"
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint:{
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'  // or whatever size limit you prefer
    },
  },
};

export default nextConfig;