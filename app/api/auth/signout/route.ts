import { logtoConfig, signOut } from "@/auth";

export async function GET() {
  await signOut({ redirect: false });
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://uwy86h.logto.app/oidc/session/end?${new URLSearchParams(
        {
          post_logout_redirect_uri: `${logtoConfig.baseUrl}`,
        }
      )}`,
    },
  });
}
