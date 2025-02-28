import type { Metadata } from "next";
import { auth } from "@/auth";
import { ClientLayout } from "@/components/layout/client-layout";
import { LoadingScreen } from "@/components/loading-screen";
import { RedirectWithDelay } from "@/components/redirect-with-delay";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard | Gendaia",
  description:
    "Gerencie seus agendamentos e clientes de forma inteligente com a Gendaia.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Dashboard | Gendaia",
    description: "Área administrativa da Gendaia.",
    images: [
      {
        url: "/dashboard-og.jpg",
        width: 1200,
        height: 630,
        alt: "Dashboard Gendaia",
      },
    ],
  },
};

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
