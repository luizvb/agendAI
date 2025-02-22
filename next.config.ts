import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_LOGTO_ENDPOINT: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT,
    NEXT_PUBLIC_LOGTO_APP_ID: process.env.NEXT_PUBLIC_LOGTO_APP_ID,
    NEXT_PUBLIC_LOGTO_CALLBACK: process.env.NEXT_PUBLIC_LOGTO_CALLBACK,
    LOGTO_APP_SECRET: process.env.LOGTO_APP_SECRET,
    LOGTO_TENANT_ID: process.env.LOGTO_TENANT_ID,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const tenantId = process.env.LOGTO_TENANT_ID;
    return [
      {
        source: "/logto/:path*",
        destination: `https://${tenantId}.logto.app/:path*`,
      },
      {
        source: "/logto/admin/:path*",
        destination: `https://${tenantId}.logto.app/oidc/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
