import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgendAI - Sistema de Gestão para Salões de Beleza",
  description:
    "Gerencie seu salão de beleza com eficiência. Agendamento online, gestão financeira e muito mais!",
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
