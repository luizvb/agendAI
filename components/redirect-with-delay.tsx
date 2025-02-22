"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectWithDelay({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(to);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router, to]);

  return <LoadingScreen />;
}
