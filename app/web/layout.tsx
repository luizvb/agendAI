import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gendaia - AI que agenda!",
  description:
    "Gerencie seu negócio com eficiência. Agendamento online, gestão financeira e muito mais!",
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
