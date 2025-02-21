import "next-auth";

declare module "next-auth" {
  interface Session {
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
