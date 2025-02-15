import { signOut } from "@/auth";

export async function GET() {
  await signOut();

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
