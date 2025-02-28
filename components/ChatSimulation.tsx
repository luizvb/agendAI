"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const schedulingMessages = [
  {
    id: 1,
    type: "user",
    text: "Olá! Gostaria de agendar um horário para corte de cabelo",
    delay: 0,
  },
  {
    id: 2,
    type: "bot",
    text: "Claro! Temos horários disponíveis amanhã às 14h ou 16h. Qual você prefere?",
    delay: 1000,
  },
  {
    id: 3,
    type: "user",
    text: "14h seria perfeito!",
    delay: 2000,
  },
  {
    id: 4,
    type: "bot",
    text: "Ótimo! Agendei seu horário para amanhã às 14h. Enviarei uma confirmação 2h antes. Posso ajudar em mais alguma coisa?",
    delay: 3000,
  },
];

const feedbackMessages = [
  {
    id: 1,
    type: "bot",
    text: "Olá! Como foi seu atendimento? Poderia avaliar de 1 a 5 estrelas? Seu feedback é muito importante para nós! ⭐️",
    delay: 0,
  },
  {
    id: 2,
    type: "user",
    text: "5 estrelas! Adorei o atendimento, muito obrigado!",
    delay: 1000,
  },
  {
    id: 3,
    type: "bot",
    text: "Que ótimo! Muito obrigado pelo feedback! 😊",
    delay: 2000,
  },
];

const communicationMessages = [
  {
    id: 1,
    type: "bot",
    text: "Olá! Já faz 15 dias desde seu último corte. Que tal agendarmos novamente? Temos horários disponíveis essa semana! 📅",
    delay: 0,
  },
  {
    id: 2,
    type: "user",
    text: "Oi! Sim, estava mesmo precisando cortar. Quais horários têm disponíveis?",
    delay: 1000,
  },
  {
    id: 3,
    type: "bot",
    text: "Temos disponibilidade amanhã às 10h ou 15h. Qual horário seria melhor para você?",
    delay: 2000,
  },
  {
    id: 4,
    type: "user",
    text: "10h está ótimo!",
    delay: 3000,
  },
  {
    id: 5,
    type: "bot",
    text: "Perfeito! Agendei seu horário para amanhã às 10h. Até lá! 😊",
    delay: 4000,
  },
];

interface ChatSimulationProps {
  chatType: "scheduling" | "feedback" | "communication";
}

export default function ChatSimulation({ chatType }: ChatSimulationProps) {
  const messages = {
    scheduling: schedulingMessages,
    feedback: feedbackMessages,
    communication: communicationMessages,
  }[chatType];

  const [started, setStarted] = useState(true);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  useEffect(() => {
    if (started) {
      let currentIndex = 0;
      const intervals: NodeJS.Timeout[] = [];

      messages.forEach((message) => {
        const timeout = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, message.id]);
          currentIndex++;
        }, message.delay);

        intervals.push(timeout);
      });

      return () => {
        intervals.forEach((interval) => clearTimeout(interval));
      };
    }
  }, [started, messages]);

  const handleStart = () => {
    setStarted(true);
    setVisibleMessages([]);
  };

  return (
    <div className="grid gap-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="bg-[#075E54] p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-white">
            <h3 className="font-semibold">Barbearia</h3>
            <p className="text-xs text-gray-200">online</p>
          </div>
        </div>
        <div
          className="p-4 space-y-4 min-h-[400px] max-h-[400px] overflow-y-auto"
          style={{
            backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABoSURBVDiNY/z//z8DNQETlKYZGLGIjQBDGaHyNDT0/4iB2NT9x6aOgYGBgfE/EDAxMjIwMDAwMGNRzI0k/huq+xpUPQMDAwPjMAgylJn4D5jnGRj+MzJRxYvUNZTxwKfDf6p4mIGBAQC5Ww1FG+mcMAAAAABJRU5ErkJggg==")`,
            backgroundColor: "#ECE5DD",
          }}
        >
          <AnimatePresence>
            {messages.map(
              (message) =>
                visibleMessages.includes(message.id) && (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] relative ${
                        message.type === "user"
                          ? "bg-[#DCF8C6] text-black"
                          : "bg-white text-black"
                      }`}
                    >
                      {message.text}
                      <span className="text-[10px] text-gray-500 ml-2 inline-block mt-1">
                        {new Date().toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
