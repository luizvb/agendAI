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
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
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
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
