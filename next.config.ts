import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
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

export default nextConfig;
