import { logtoConfig, signOut } from "@/auth";

export async function GET() {
  await signOut({ redirect: false });
  const tenantId = process.env.LOGTO_TENANT_ID;
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://${tenantId}.logto.app/oidc/session/end?${new URLSearchParams(
        {
          post_logout_redirect_uri: `${logtoConfig.baseUrl}`,
        }
      )}`,
    },
  });
}
