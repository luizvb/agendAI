import { signIn } from "@/auth";

export async function GET() {
  await signIn("logto");

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
