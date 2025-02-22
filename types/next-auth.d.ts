import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    organizationId: string;
  }

  interface Session {
    user: User;
    accessToken?: string;
    idToken?: string;
    decodedToken?: {
      sub: string;
      email?: string;
      name?: string;
      [key: string]: any;
    };
  }
}
