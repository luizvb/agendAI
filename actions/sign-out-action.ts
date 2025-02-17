"use server";

import { logtoConfig, signOut } from "@/auth";
import { redirect } from "next/navigation"; // Para Next.js 13+ usando app router

function getSignOutUrl(baseUrl: string): string {
  return `https://uwy86h.logto.app/oidc/session/end?${new URLSearchParams({
    post_logout_redirect_uri: `${baseUrl}`,
  })}`;
}

export async function signOutAction() {
  await signOut({ redirect: false });

  const url = getSignOutUrl(logtoConfig.baseUrl);

  console.log("Redirecting to", url);

  redirect(url);
}
