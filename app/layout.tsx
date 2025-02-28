import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gendaia | AI que agenda!",
  description:
    "Agende seus serviços de forma inteligente com a Gendaia. Nossa IA torna o agendamento mais fácil, rápido e eficiente para você e seus clientes.",
  keywords: [
    "agendamento",
    "IA",
    "inteligência artificial",
    "serviços",
    "agenda online",
    "barbearia",
    "salão",
    "automatização",
    "sistema de agendamento",
    "agendamento de serviços",
    "agendamento de barbearia",
    "agendamento de salão",
  ],
  authors: [{ name: "Gendaia" }],
  creator: "Gendaia",
  publisher: "Gendaia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gendaia.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gendaia | AI que agenda!",
    description:
      "Agende seus serviços de forma inteligente com a Gendaia. Nossa IA torna o agendamento mais fácil, rápido e eficiente.",
    url: "https://gendaia.com",
    siteName: "Gendaia",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gendaia - AI que agenda!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gendaia | AI que agenda!",
    description: "Agende seus serviços de forma inteligente com a Gendaia.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "adicione_seu_codigo_de_verificacao_google",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
