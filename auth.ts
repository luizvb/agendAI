import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "logto",
      name: "Logto",
      type: "oidc",
      issuer: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT,
      clientId: process.env.NEXT_PUBLIC_LOGTO_APP_ID,
      clientSecret: process.env.LOGTO_APP_SECRET,
      authorization: {
        params: { scope: "openid offline_access profile email" },
      },
      profile(profile, tokens) {
        // You can customize the user profile mapping here
        return {
          id: profile.sub,
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.picture,
          accessToken: tokens.access_token,
          accessTokenId: tokens.id_token,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenId = account.id_token;
      }
      return token;
    },
    async session({ session, user, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        accessTokenId: token.accessTokenId,
      };
    },
  },
});
