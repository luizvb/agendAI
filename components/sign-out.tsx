import { signOutAction } from "@/actions/sign-out-action";

export function SignOut() {
  return (
    <form action={signOutAction}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
