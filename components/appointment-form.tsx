"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ClientSelect } from "./client-select";
import { ServiceSelect } from "./service-select";
import { ProfessionalSelect } from "./professional-select";
import { DateTimePicker } from "./date-time-picker";
import { appointmentService } from "@/services/appointmentService";
import { clientService } from "@/services/clientService";
import { Client } from "@/types/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  clientId: z.number({
    required_error: "Por favor selecione um cliente",
  }),
  serviceId: z.number({
    required_error: "Por favor selecione um serviço",
  }),
  professionalId: z.number({
    required_error: "Por favor selecione um profissional",
  }),
  startTime: z.string({
    required_error: "Por favor selecione uma data e hora",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function AppointmentForm() {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: undefined,
      serviceId: undefined,
      professionalId: undefined,
      startTime: "",
    },
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.list();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar a lista de clientes",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: FormData) => {
    try {
      await appointmentService.create({
        clientId: values.clientId,
        serviceId: values.serviceId,
        professionalId: values.professionalId,
        startTime: values.startTime,
      });

      toast({
        title: "Agendamento realizado",
        description: "O agendamento foi criado com sucesso!",
      });

      router.push("/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o agendamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <ClientSelect
                  value={field.value}
                  onChange={field.onChange}
                  clients={clients}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço</FormLabel>
              <FormControl>
                <ServiceSelect value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="professionalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissional</FormLabel>
              <FormControl>
                <ProfessionalSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e Hora</FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Agendar
        </Button>
      </form>
    </Form>
  );
}
