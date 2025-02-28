"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatSimulation from "@/components/ChatSimulation";
import { motion } from "framer-motion";
import React from "react";

export default function MarketingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = [
    { highlight: "trabalho", text: "Onde o trabalho acontece" },
    { highlight: "sucesso", text: "Onde o sucesso começa" },
    { highlight: "negócio", text: "Onde seu negócio cresce" },
  ];

  useEffect(() => {
    if (session) {
      router.push("https://app.gendaia.com.br/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            if (prev.hours === 0) {
              clearInterval(timer);
              return prev;
            }
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((current) => (current + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">Gendaia</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button
                variant="outline"
                className="relative h-8 w-full justify-start text-sm font-normal md:w-40 md:justify-between"
                onClick={() => router.push("https://app.gendaia.com.br/login")}
              >
                <span>Login</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <motion.h1
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary">
                {titles[titleIndex].highlight}
              </span>{" "}
              {titles[titleIndex].text}
            </motion.h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Transforme seu negócio com a Gendaia. Nossa plataforma de
              agendamento inteligente torna tudo mais fácil para você e seus
              clientes.
            </p>
            <div className="space-x-4">
              <Button
                size="lg"
                onClick={() =>
                  router.push("https://app.gendaia.com.br/register")
                }
              >
                Comece Agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  router.push("https://app.gendaia.com.br/pricing")
                }
              >
                Preços
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <ChatSimulation chatType="scheduling" />
        </section>
      </main>
    </div>
  );
}
