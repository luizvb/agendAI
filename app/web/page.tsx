import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WebPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">AgendAI</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Funcionalidades
          </Link>
          <Link href="#benefits" className="text-gray-600 hover:text-gray-900">
            Benefícios
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-600 hover:text-gray-900"
          >
            Depoimentos
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
            Planos e Preços
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="default" className="bg-purple-900">
              Experimentar grátis por 7 dias
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 px-4 py-2 rounded-full mb-6">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-semibold">
                Potencializado por Inteligência Artificial
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
              Sua secretária virtual inteligente que nunca dorme
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Não é um simples chatbot. É uma IA avançada que entende seus
              clientes, gerencia sua agenda e otimiza seu faturamento 24 horas
              por dia, 7 dias por semana.
            </p>
            <Button className="bg-purple-900 text-white px-8 py-6 text-lg">
              Experimente grátis por 7 dias
            </Button>
          </div>
          <div className="relative h-[600px]">
            <Image
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Mais que um sistema, uma assistente virtual inteligente
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Com o AgendAI, você tem uma secretária virtual que trabalha 24h por
            dia para maximizar seus resultados.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full -mr-12 -mt-12"></div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-purple-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Atendimento Inteligente
              </h3>
              <p className="text-gray-600">
                IA que entende naturalmente as solicitações dos clientes e
                agenda serviços de forma autônoma
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full -mr-12 -mt-12"></div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-purple-900"
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
              <h3 className="text-xl font-semibold mb-2">
                Otimização Inteligente
              </h3>
              <p className="text-gray-600">
                Organiza automaticamente sua agenda para maximizar o faturamento
                e reduzir horários ociosos
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full -mr-12 -mt-12"></div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-purple-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Comunicação Natural
              </h3>
              <p className="text-gray-600">
                Conversa naturalmente com seus clientes, entende preferências e
                faz recomendações personalizadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="/benefits-image.png"
                alt="Benefícios"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8">
                Transforme seu salão com Inteligência Artificial
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-green-500"
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
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Nunca perca um cliente
                    </h3>
                    <p className="text-gray-600">
                      Atendimento 24/7 com IA que agenda, confirma e lembra os
                      clientes automaticamente
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-green-500"
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
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Experiência personalizada
                    </h3>
                    <p className="text-gray-600">
                      IA que aprende as preferências dos clientes e oferece
                      recomendações personalizadas
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-green-500"
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
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Otimização automática
                    </h3>
                    <p className="text-gray-600">
                      IA que organiza sua agenda para maximizar o faturamento e
                      reduzir horários vazios
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Planos que cabem no seu bolso
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Básico</h3>
              <div className="text-4xl font-bold mb-6">
                R$ 99<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li>Agendamento online</li>
                <li>Até 2 profissionais</li>
                <li>Relatórios básicos</li>
              </ul>
              <Button className="w-full bg-purple-900">Começar agora</Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-purple-900 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-900 text-white px-4 py-1 rounded-full text-sm">
                Mais popular
              </div>
              <h3 className="text-xl font-semibold mb-4">Profissional</h3>
              <div className="text-4xl font-bold mb-6">
                R$ 199<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li>Tudo do plano Básico</li>
                <li>Até 5 profissionais</li>
                <li>Gestão financeira</li>
                <li>Relatórios avançados</li>
              </ul>
              <Button className="w-full bg-purple-900">Começar agora</Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Premium</h3>
              <div className="text-4xl font-bold mb-6">
                R$ 299<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li>Tudo do plano Profissional</li>
                <li>Profissionais ilimitados</li>
                <li>Suporte prioritário</li>
                <li>API personalizada</li>
              </ul>
              <Button className="w-full bg-purple-900">Começar agora</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AgendAI</h3>
            <p className="text-gray-400">
              A melhor solução para gestão do seu salão de beleza
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-400 hover:text-white"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-gray-400 hover:text-white"
                >
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Termos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
