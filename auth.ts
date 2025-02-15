import NextAuth from "next-auth";

export const logtoConfig = {
  endpoint: "https://uwy86h.logto.app/oidc",
  appId: "p36ogscjg7vcwgz20mg9m",
  appSecret: "SiB7TwbgtU72q9LbVKTP4NLHMpe1IndM",
  baseUrl: "http://localhost:3001", // Change to your own base URL
  cookieSecret: "jwgIhsNon95zPpRpBtqxEjzlodRAb1rz", // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === "production",
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
        params: { scope: "openid offline_access profile email" },
      },
      profile(profile) {
        // You can customize the user profile mapping here
        return {
          id: profile.sub,
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
});
