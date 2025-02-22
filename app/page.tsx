import Image from "next/image";
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
      <section className="relative py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f4e6ff] text-[#820AD1] px-4 py-2 rounded-full mb-6">
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sua assistente virtual inteligente que nunca dorme
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Não é um simples chatbot. É uma IA avançada que entende seus
              clientes, gerencia sua agenda e otimiza seu faturamento 24 horas
              por dia, 7 dias por semana. Ideal para consultórios, clínicas,
              salões de beleza, barbearias e qualquer negócio que trabalhe com
              agendamentos.
            </p>
            <Button className="bg-[#820AD1] hover:bg-[#6b0aad] text-white px-8 py-6 text-lg">
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
      <section id="features" className="py-20 bg-[#f9f9f9] px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Mais que um sistema, uma assistente virtual inteligente
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Com o AgendAI, você tem uma assistente virtual que trabalha 24h por
            dia para maximizar os resultados do seu negócio.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden border border-[#f4e6ff]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-900/5 rounded-full -mr-12 -mt-12"></div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-gray-900"
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
            <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden border border-[#f4e6ff]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-900/5 rounded-full -mr-12 -mt-12"></div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-gray-900"
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
            <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden border border-[#f4e6ff]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-900/5 rounded-full -mr-12 -mt-12"></div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-gray-900"
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
      <section id="benefits" className="py-20 px-6 bg-white">
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
                Transforme seu negócio com Inteligência Artificial
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
                      Algoritmos inteligentes que organizam sua agenda para
                      maximizar o faturamento
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#f9f9f9] px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-gray-600 mb-4">
                "O AgendAI transformou meu consultório. Agora tenho mais tempo
                para focar no que realmente importa: atender meus pacientes."
              </p>
              <p className="font-semibold">Dra. Maria Silva</p>
              <p className="text-sm text-gray-500">Clínica Bem Estar</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-gray-600 mb-4">
                "Incrível como a IA entende exatamente o que meus clientes
                precisam. Minha agenda está sempre otimizada."
              </p>
              <p className="font-semibold">João Santos</p>
              <p className="text-sm text-gray-500">Barbearia Modern</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-gray-600 mb-4">
                "Desde que comecei a usar o AgendAI, meu faturamento aumentou em
                40%. A gestão do meu salão ficou muito mais eficiente!"
              </p>
              <p className="font-semibold">Ana Oliveira</p>
              <p className="text-sm text-gray-500">Studio Ana Beauty</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Planos que cabem no seu bolso
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#f4e6ff]">
              <h3 className="text-xl font-semibold mb-4">Básico</h3>
              <div className="text-4xl font-bold mb-6">
                R$ 97<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
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
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
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
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
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
              <Button className="w-full bg-[#820AD1] hover:bg-[#6b0aad] text-white">
                Começar agora
              </Button>
            </div>
            <div className="bg-[#820AD1] text-white p-8 rounded-lg shadow-lg scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-sm font-semibold px-4 py-1 rounded-bl-lg rounded-tr-lg">
                Mais popular
              </div>
              <h3 className="text-xl font-semibold mb-4">Profissional</h3>
              <div className="text-4xl font-bold mb-6">
                R$ 197<span className="text-lg opacity-75">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
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
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
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
                  <span>Atendimento prioritário</span>
                </li>
                <li className="flex items-center gap-2">
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
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-center gap-2">
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
                  <span>Personalização avançada</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-[#820AD1] hover:bg-[#f4e6ff]">
                Começar agora
              </Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#f4e6ff]">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="text-4xl font-bold mb-6">
                R$ 497<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
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
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
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
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
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
              <Button className="w-full bg-[#820AD1] hover:bg-[#6b0aad] text-white">
                Fale conosco
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#820AD1] text-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comece agora com 7 dias grátis. Sem compromisso.
          </p>
          <Button className="bg-white text-[#820AD1] hover:bg-[#f4e6ff] px-8 py-6 text-lg">
            Começar gratuitamente
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f9f9f9] text-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AgendAI</h3>
            <p className="text-gray-400">
              Transformando negócios com Inteligência Artificial
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
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2024 AgendAI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
