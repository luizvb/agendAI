"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
  session: any;
}

export default function Providers({ children, session }: ProvidersProps) {
  useEffect(() => {
    console.log("session", session);
    if (session?.accessTokenId) {
      localStorage.setItem("jwt-token", session.accessTokenId);
      localStorage.setItem("authenticated", "true");
    }
  }, [session]);

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
