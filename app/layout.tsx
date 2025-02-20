import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { headers } from "next/headers";
// import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgendAI",
  description: "Schedule Barber",
};

const publicPages = ["/schedule", "/another-page"]; // Adicione outras páginas conforme necessário

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remover o useRouter e usar headers() para obter o pathname
  const headersList = await headers();
  console.log("headersList", headersList);
  const pathname = headersList.get("x-pathname") || "/";
  const session = publicPages.includes(pathname) ? null : await auth();

  console.log("pathname", pathname);

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/sw.js")
  //       .then((registration) => {
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Service Worker registration failed:", error);
  //       });
  //   }
  // }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {session ? (
          <>
            <div className="[--header-height:calc(theme(spacing.14))]">
              <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                  <AppSidebar user={session} />
                  <SidebarInset>
                    <div className="flex-grow">{children}</div>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </>
        ) : (
          <>
            {publicPages.includes(pathname) ? (
              <div className="flex-grow">{children}</div>
            ) : (
              <SignIn />
            )}
          </>
        )}
      </body>
    </html>
  );
}
