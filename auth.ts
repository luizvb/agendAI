import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    decodedToken?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    decodedToken?: any;
  }
}

export const logtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID,
  appSecret: process.env.LOGTO_APP_SECRET,
  baseUrl: process.env.NEXTAUTH_URL || "https://agendai-v1.vercel.app",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET,
  cookieSecure: process.env.NODE_ENV === "production",
  tenantId: process.env.LOGTO_TENANT_ID,
  resources: [process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"],
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "logto",
      name: "Logto",
      type: "oidc",
      clientId: logtoConfig.appId,
      clientSecret: logtoConfig.appSecret,
      issuer: logtoConfig.endpoint,
      authorization: {
        params: {
          scope:
            "openid profile email offline_access urn:logto:scope:organizations urn:logto:scope:organization_roles roles identities",
          // organization_id: "6j55dtntt7x0", // Adicione o organization_id aqui
        },
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        const decodedToken = JSON.parse(
          Buffer.from(account.id_token.split(".")[1], "base64").toString()
        );
        token.idToken = account.id_token;
        token.decodedToken = decodedToken;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.decodedToken = token.decodedToken;
      session.idToken = token.idToken;
      session.accessToken = token.accessToken;

      return session;
    },
  },
  trustHost: true,
});
