import { signIn } from "@/auth";

export async function GET() {
  await signIn("logto");

  return Response.json(
    { url: "/" },
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
