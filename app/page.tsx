"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatSimulation from "@/components/ChatSimulation";

export default function WebPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
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

  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o AgendAI",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b">
        <nav className="max-w-[1360px] mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <img src="/logo.png" alt="AgendAI Logo" className="h-24" />
            <div className="hidden md:flex items-center gap-6"></div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#611f69] font-semibold">
            <span>Teste 30 dias gratuitamente clicando agora!</span>
            <span className="bg-[#611f69]/10 px-3 py-1 rounded-full">
              {String(Math.floor(timeLeft.hours)).padStart(2, "0")}:
              {String(Math.floor(timeLeft.minutes)).padStart(2, "0")}:
              {String(Math.floor(timeLeft.seconds)).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="hidden sm:flex"
            >
              Entrar
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-[#611f69] hover:bg-[#4a1751] text-white font-semibold"
            >
              COMEÇAR
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="max-w-[1360px] mx-auto px-5 py-20">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Onde o <span className="text-[#611f69]">trabalho</span> acontece
            </h1>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto mb-8">
              Automatize seus agendamentos e nunca mais perca um cliente. Nossa
              IA trabalha 24h por dia para maximizar sua agenda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleWhatsAppClick}
                className="bg-[#611f69] hover:bg-[#4a1751] text-white px-8 py-6 text-lg font-semibold"
              >
                COMEÇAR GRATUITAMENTE
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-[#611f69] text-[#611f69] hover:bg-[#611f69]/5 px-8 py-6 text-lg"
              >
                VER PLANOS →
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              AgendAI é grátis para testar. Cancele quando quiser.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 bg-[#611f69]/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-[#611f69] rounded-full animate-pulse"></div>
              <span className="text-[#611f69] font-semibold">
                +500 agendamentos efetuados com nossa AI
              </span>
            </div>
          </div>
          <video
            src="/demo.mov"
            autoPlay
            muted
            loop
            className="w-full h-auto"
            ref={(el) => {
              if (el) {
                el.playbackRate = 2.5;
              }
            }}
          />
        </section>

        {/* IA + WhatsApp Section */}
        <section className="py-24 bg-white">
          <div className="max-w-[1360px] mx-auto px-5">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-sm font-semibold text-[#611f69] mb-2">
                  IA + WHATSAPP
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Gerencie agendamentos e mova seu negócio adiante mais rápido
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Nossa IA conversa naturalmente com seus clientes via WhatsApp,
                  entendendo preferências e agendando horários automaticamente,
                  24 horas por dia.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-4xl font-bold text-[#611f69]">47%</div>
                  <p className="text-slate-600">
                    de aumento na produtividade dos negócios usando AgendAI
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -right-20 -top-20 -bottom-20 -z-10">
                  <div className="w-[500px] h-[500px] rounded-full opacity-20"></div>
                </div>
                <ChatSimulation chatType="scheduling" />
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-[1360px] mx-auto px-5">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -left-20 -top-20 -bottom-20 -z-10">
                    <div className="w-[500px] h-[500px] bg-[#36c5f0] rounded-full opacity-10"></div>
                  </div>
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 p-2 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <video
                      src="/dashboard.mov"
                      autoPlay
                      muted
                      loop
                      className="w-full h-auto"
                      ref={(el) => {
                        if (el) {
                          el.playbackRate = 2.5;
                        }
                      }}
                      // className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="text-sm font-semibold text-[#611f69] mb-2">
                  DASHBOARD
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Visualize e gerencie tudo em um só lugar
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Dashboard completo com métricas em tempo real, controle
                  financeiro e análise de desempenho para tomar as melhores
                  decisões para seu negócio.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-4xl font-bold text-[#611f69]">89%</div>
                  <p className="text-slate-600">
                    dos usuários tomam decisões melhores com nosso dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lembretes Section */}
        <section className="py-24 bg-white">
          <div className="max-w-[1360px] mx-auto px-5">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-sm font-semibold text-[#611f69] mb-2">
                  LEMBRETES
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Automatize comunicações e reduza faltas
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Sistema inteligente de lembretes e confirmações via WhatsApp
                  que reduz faltas em até 95% e mantém sua agenda sempre
                  otimizada.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-4xl font-bold text-[#611f69]">95%</div>
                  <p className="text-slate-600">
                    de redução em faltas com nosso sistema de lembretes
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -right-20 -top-20 -bottom-20 -z-10">
                  <div className="w-[500px] h-[500px] bg-[#e01e5a] rounded-full opacity-10"></div>
                </div>
                <ChatSimulation chatType="communication" />
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#611f69]/10 border border-[#611f69]/20 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-[#611f69] mb-4">
                  20%
                </div>
                <h3 className="text-xl font-semibold mb-2">Mais Faturamento</h3>
                <p className="text-gray-600">
                  Nossos clientes aumentam em média 20% seu faturamento no
                  primeiro mês
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-[#611f69]/10 border border-[#611f69]/20 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-[#611f69] mb-4">
                  95%
                </div>
                <h3 className="text-xl font-semibold mb-2">Menos Faltas</h3>
                <p className="text-gray-600">
                  Redução drástica no número de faltas com nosso sistema de
                  confirmação
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-[#611f69]/10 border border-[#611f69]/20 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-[#611f69] mb-4">
                  24/7
                </div>
                <h3 className="text-xl font-semibold mb-2">Atendimento</h3>
                <p className="text-gray-600">
                  Sua agenda sendo preenchida mesmo quando você está dormindo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI System Section */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Inteligência Artificial + WhatsApp = Mais Resultados
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#611f69]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-[#611f69]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        Agendamento Automático 24/7
                      </h3>
                      <p className="text-gray-700">
                        Nossa IA conversa naturalmente com seus clientes via
                        WhatsApp, entende suas preferências e agenda horários
                        automaticamente, respeitando sua disponibilidade.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#611f69]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-[#611f69]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Gestão Inteligente de Agenda
                      </h3>
                      <p className="text-gray-600">
                        A IA otimiza sua agenda automaticamente, evitando
                        horários ociosos e maximizando seu faturamento com base
                        no histórico de atendimentos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#611f69]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-[#611f69]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Confirmações e Lembretes
                      </h3>
                      <p className="text-gray-600">
                        Sistema automático de confirmação e lembretes via
                        WhatsApp, reduzindo faltas em até 95%. A IA até reagenda
                        automaticamente em caso de cancelamentos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#611f69]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-[#611f69]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Análise e Insights
                      </h3>
                      <p className="text-gray-600">
                        Receba insights valiosos sobre seus clientes, horários
                        mais rentáveis e oportunidades de crescimento, tudo pelo
                        WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ChatSimulation chatType="feedback" />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-700 text-center mb-16 max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio e comece a aumentar seu
              faturamento hoje mesmo
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Basic Plan */}
              <div className="rounded-3xl border border-[#611f69]/20 p-8 bg-[#611f69]/5 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Básico</h3>
                    <p className="text-gray-700">
                      Para profissionais autônomos
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#611f69]">
                      R$ 29,90
                    </div>
                    <div className="text-sm text-gray-600">por mês</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#611f69]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-900">
                      Agendamento automático via WhatsApp
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#611f69]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-900">
                      Confirmações e lembretes
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#611f69]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-900">Dashboard básico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#611f69]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-900">1 profissional</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#611f69]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-900">Lembretes automáticos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#611f69]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-900">Avaliações básicas</span>
                  </li>
                </ul>

                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#611f69] hover:bg-[#4a1751] text-white rounded-xl"
                >
                  Começar agora
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-3xl border border-[#611f69]/20 p-8 bg-gradient-to-br from-[#611f69] to-[#4a1751] hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-6 right-6">
                  <div className="bg-white text-[#611f69] text-xs font-bold px-3 py-1 rounded-full">
                    MAIS POPULAR
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Pro</h3>
                    <p className="text-white/80">Para salões e barbearias</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      R$ 59,90
                    </div>
                    <div className="text-sm text-white/80">por mês</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 text-white">
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">Tudo do plano Básico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">Até 5 profissionais</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">
                      Controle financeiro completo
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">Relatórios avançados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">
                      Lembretes personalizáveis
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">
                      Sistema completo de avaliações
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white">Relatórios de satisfação</span>
                  </li>
                </ul>

                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-white hover:bg-white/90 text-[#611f69] rounded-xl"
                >
                  Começar agora
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cases Section */}
        <section className="py-20 bg-[#f9f9f9] px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Histórias de Sucesso
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#611f69] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    JS
                  </div>
                  <div>
                    <p className="font-semibold text-xl text-gray-900">
                      João Santos
                    </p>
                    <p className="text-gray-500">Barbearia Modern</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg mb-4">
                  "Aumentei meu faturamento em 45% no primeiro mês. A IA entende
                  exatamente o que meus clientes precisam e organiza minha
                  agenda perfeitamente."
                </p>
                <div className="flex items-center gap-2 text-[#611f69]">
                  <span className="font-bold">+45%</span>
                  <span>de faturamento</span>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#611f69] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    AO
                  </div>
                  <div>
                    <p className="font-semibold text-xl text-gray-900">
                      Ana Oliveira
                    </p>
                    <p className="text-gray-500">Studio Ana Beauty</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg mb-4">
                  "Minha agenda está sempre cheia e organizada. O melhor é que a
                  IA trabalha 24h por dia, então acordo com novos agendamentos
                  todos os dias!"
                </p>
                <div className="flex items-center gap-2 text-[#611f69]">
                  <span className="font-bold">+38%</span>
                  <span>de clientes novos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#611f69]/10 rounded-full mb-8">
              <svg
                className="w-12 h-12 text-[#611f69]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Garantia de Satisfação
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Se você não aumentar seu faturamento em pelo menos 30% no primeiro
              mês, devolvemos seu dinheiro. Sem perguntas.
            </p>
            <Button
              onClick={handleWhatsAppClick}
              className="bg-[#611f69] hover:bg-[#4a1751] text-white px-8 py-6 text-lg flex items-center mx-auto rounded-xl"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Começar Agora
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-[1360px] mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Add footer content */}
          </div>
        </div>
      </footer>
    </div>
  );
}
