import { auth } from "@/auth";
import { ClientLayout } from "@/components/layout/client-layout";
import { LoadingScreen } from "@/components/loading-screen";
import { RedirectWithDelay } from "@/components/redirect-with-delay";
import { Suspense } from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <RedirectWithDelay to="/api/auth/signin" />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ClientLayout session={session}>{children}</ClientLayout>
    </Suspense>
  );
}
