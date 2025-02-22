import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WebPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-black">AgendAI</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-[#820AD1]">
            Funcionalidades
          </Link>
          <Link href="#benefits" className="text-gray-600 hover:text-[#820AD1]">
            Benefícios
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-600 hover:text-[#820AD1]"
          >
            Depoimentos
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-[#820AD1]">
            Planos e Preços
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/appointments">
            <Button
              variant="outline"
              className="bg-[#820AD1] hover:bg-[#6b0aad] text-white"
            >
              Entrar
            </Button>
          </Link>
          <Link href="/appointments">
            <Button className="bg-[#820AD1] hover:bg-[#6b0aad] text-white">
              Experimentar grátis por 7 dias
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-[#820AD1] to-[#6b0aad] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6">
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
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sua assistente virtual inteligente que nunca dorme
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Não é um simples chatbot. É uma IA avançada que entende seus
              clientes, gerencia sua agenda e otimiza seu faturamento 24 horas
              por dia, 7 dias por semana. Ideal para consultórios, clínicas,
              salões de beleza, barbearias e qualquer negócio que trabalhe com
              agendamentos.
            </p>
            <div className="flex gap-4">
              <Link href="/appointments">
                <Button className="bg-white text-[#820AD1] hover:bg-white/90 px-8 py-6 text-lg">
                  Experimente grátis por 7 dias
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Mais que um sistema, uma assistente virtual inteligente
            </h2>
            <p className="text-xl text-gray-600">
              Com o AgendAI, você tem uma assistente virtual que trabalha 24h
              por dia para maximizar os resultados do seu negócio.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#f4e6ff] to-white border border-[#f4e6ff] hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#820AD1] rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-2xl font-semibold mb-4">
                Atendimento Inteligente
              </h3>
              <p className="text-gray-600">
                IA que entende naturalmente as solicitações dos clientes e
                agenda serviços de forma autônoma
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#f4e6ff] to-white border border-[#f4e6ff] hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#820AD1] rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-2xl font-semibold mb-4">
                Otimização Inteligente
              </h3>
              <p className="text-gray-600">
                Organiza automaticamente sua agenda para maximizar o faturamento
                e reduzir horários ociosos
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#f4e6ff] to-white border border-[#f4e6ff] hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#820AD1] rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-2xl font-semibold mb-4">
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
      <section id="benefits" className="py-20 px-6 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Transforme seu negócio com Inteligência Artificial
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#820AD1]/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#820AD1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Disponível</h3>
              <p className="text-gray-600">
                Nunca perca um cliente. Atendimento automático 24 horas por dia.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#820AD1]/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#820AD1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">+40% Faturamento</h3>
              <p className="text-gray-600">
                Aumente seu faturamento com otimização inteligente de agenda.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#820AD1]/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#820AD1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">95% Satisfação</h3>
              <p className="text-gray-600">
                Clientes mais satisfeitos com atendimento personalizado.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#820AD1]/10 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#820AD1]"
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
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-gray-600">
                Dados criptografados e conformidade com LGPD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            O que nossos clientes dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#f4e6ff] to-white p-8 rounded-2xl">
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-[#820AD1]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                "O AgendAI transformou meu consultório. Agora tenho mais tempo
                para focar no que realmente importa: atender meus pacientes."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#820AD1] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  MS
                </div>
                <div>
                  <p className="font-semibold">Dra. Maria Silva</p>
                  <p className="text-sm text-gray-500">Clínica Bem Estar</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f4e6ff] to-white p-8 rounded-2xl">
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-[#820AD1]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                "Incrível como a IA entende exatamente o que meus clientes
                precisam. Minha agenda está sempre otimizada."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#820AD1] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  JS
                </div>
                <div>
                  <p className="font-semibold">João Santos</p>
                  <p className="text-sm text-gray-500">Barbearia Modern</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f4e6ff] to-white p-8 rounded-2xl">
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-[#820AD1]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                "Desde que comecei a usar o AgendAI, meu faturamento aumentou em
                40%. A gestão do meu salão ficou muito mais eficiente!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#820AD1] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  AO
                </div>
                <div>
                  <p className="font-semibold">Ana Oliveira</p>
                  <p className="text-sm text-gray-500">Studio Ana Beauty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-2xl font-semibold mb-4">Básico</h3>
              <div className="text-4xl font-bold mb-6 text-[#820AD1]">
                R$ 49<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
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
                  <span>Até 100 agendamentos/mês</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
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
                  <span>Atendimento 24/7</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
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
                  <span>Relatórios básicos</span>
                </li>
              </ul>
              <Link href="/appointments">
                <Button className="w-full bg-[#820AD1] hover:bg-[#6b0aad] text-white">
                  Começar agora
                </Button>
              </Link>
            </div>
            <div className="bg-[#820AD1] text-white p-8 rounded-2xl shadow-lg scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-sm font-semibold px-4 py-1 rounded-full">
                Mais popular
              </div>
              <h3 className="text-2xl font-semibold mb-4">Profissional</h3>
              <div className="text-4xl font-bold mb-6">
                R$ 89<span className="text-lg opacity-75">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0"
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
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0"
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
                  <span>Atendimento prioritário</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0"
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
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0"
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
                  <span>Personalização avançada</span>
                </li>
              </ul>
              <Link href="/appointments">
                <Button className="w-full bg-white text-[#820AD1] hover:bg-white/90">
                  Começar agora
                </Button>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
              <div className="text-4xl font-bold mb-6 text-[#820AD1]">
                R$ 197<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
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
                  <span>Tudo do Profissional</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
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
                  <span>API personalizada</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
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
                  <span>Suporte dedicado</span>
                </li>
              </ul>
              <Link href="/appointments">
                <Button className="w-full bg-[#820AD1] hover:bg-[#6b0aad] text-white">
                  Fale conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#820AD1] to-[#6b0aad] text-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comece agora com 7 dias grátis. Sem compromisso.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/appointments">
              <Button className="bg-white text-[#820AD1] hover:bg-white/90 px-8 py-6 text-lg">
                Começar gratuitamente
              </Button>
            </Link>
            <Link href="/appointments">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Agendar demonstração
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-600 py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-black mb-4">AgendAI</h3>
            <p className="text-gray-500">
              Transformando negócios com Inteligência Artificial
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-500 hover:text-[#820AD1]"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-gray-500 hover:text-[#820AD1]"
                >
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-[#820AD1]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-500 hover:text-[#820AD1]">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-[#820AD1]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-[#820AD1]">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-500 hover:text-[#820AD1]">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-[#820AD1]">
                  Termos
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t text-center text-gray-500">
          <p>&copy; 2024 AgendAI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
