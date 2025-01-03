import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: [
    //   "uploadthing.com",
    //   "utfs.io",
    //   "img.clerk.com",
    //   "subdomain",
    //   "files.stripe.com",
    // ],
    domains: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
  },

  reactStrictMode: false,
};

export default nextConfig;
