"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation"; // Para Next.js 13+ usando app router

function getSignOutUrl(baseUrl: string): string {
  const tenantId = process.env.LOGTO_TENANT_ID;
  return `https://${tenantId}.logto.app/oidc/session/end?${new URLSearchParams({
    post_logout_redirect_uri: `${baseUrl}`,
  })}`;
}

export async function signOutAction() {
  await signOut({ redirect: false });

  const url = getSignOutUrl(process.env.NEXTAUTH_URL || "");

  console.log("Redirecting to", url);

  redirect(url);
}
