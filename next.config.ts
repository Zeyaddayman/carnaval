import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/product-images/**"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dcohzkma0/image/upload/**"
      }
    ]
  }
};

export default nextConfig;
