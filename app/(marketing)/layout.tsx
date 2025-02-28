import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gendaia | Transforme seu Agendamento com IA",
  description:
    "Revolucione a forma de agendar serviços com a Gendaia. Nossa plataforma com IA torna o agendamento mais inteligente, eficiente e personalizado para seu negócio.",
  openGraph: {
    title: "Gendaia | Transforme seu Agendamento com IA",
    description:
      "Revolucione a forma de agendar serviços com a Gendaia. Nossa plataforma com IA torna o agendamento mais inteligente e eficiente.",
    images: [
      {
        url: "/marketing-og.jpg",
        width: 1200,
        height: 630,
        alt: "Gendaia - Agendamento Inteligente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gendaia | Transforme seu Agendamento com IA",
    description: "Revolucione a forma de agendar serviços com a Gendaia.",
    images: ["/marketing-og.jpg"],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </div>
  );
}
