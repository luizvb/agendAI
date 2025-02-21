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
  endpoint: "https://uwy86h.logto.app/oidc",
  appId: "p36ogscjg7vcwgz20mg9m",
  appSecret: "SiB7TwbgtU72q9LbVKTP4NLHMpe1IndM",
  baseUrl: "http://localhost:3000", // Change to your own base URL
  cookieSecret: "jwgIhsNon95zPpRpBtqxEjzlodRAb1rz", // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === "production",
  tenantId: "uwy86h",
  resources: ["http://localhost:3001"],
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
