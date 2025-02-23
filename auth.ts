import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "logto",
      name: "Logto",
      type: "oidc",
      issuer: "https://wxyeww.logto.app/oidc",
      clientId: "9i1ej1jbvy7urrbai5wjw",
      clientSecret: "QOTJ93OLp9qyPuurNfm5Dg4o8dmzh7Cz",
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
