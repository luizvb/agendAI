"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AIConfiguration, BusinessType } from "@/types/ai";
import { aiService } from "@/services/aiService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  agentName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  businessType: z.nativeEnum(BusinessType),
  communicationStyle: z.string(),
  customRule: z.string(),
});

export function AIConfigurationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [communicationStyles, setCommunicationStyles] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: "",
      businessType: BusinessType.BARBERSHOP,
      communicationStyle: "",
      customRule: "",
    },
  });

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const config = await aiService.getConfiguration();
      form.setValue("agentName", config.agentName);
      form.setValue("businessType", config.businessType);
      setCommunicationStyles(config.communicationStyles);
      setCustomRules(config.customRules || []);
    } catch (error) {
      console.error("Error loading AI configuration:", error);
    }
  };

  const addCommunicationStyle = () => {
    const style = form.getValues("communicationStyle");
    if (style && !communicationStyles.includes(style)) {
      setCommunicationStyles([...communicationStyles, style]);
      form.setValue("communicationStyle", "");
    }
  };

  const removeCommunicationStyle = (style: string) => {
    setCommunicationStyles(communicationStyles.filter((s) => s !== style));
  };

  const addCustomRule = () => {
    const rule = form.getValues("customRule");
    if (rule && !customRules.includes(rule)) {
      setCustomRules([...customRules, rule]);
      form.setValue("customRule", "");
    }
  };

  const removeCustomRule = (rule: string) => {
    setCustomRules(customRules.filter((r) => r !== rule));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await aiService.updateConfiguration({
        agentName: values.agentName,
        businessType: values.businessType,
        communicationStyles,
        customRules,
        isActive: true,
      });
      toast.success("Configuração do AI atualizada com sucesso!");
    } catch (error) {
      console.error("Error updating AI configuration:", error);
      toast.error("Erro ao atualizar configuração do AI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Assistente Virtual</CardTitle>
        <CardDescription>
          Configure como seu assistente virtual irá interagir com os clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Assistente</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: João da Barbearia" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Negócio</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de negócio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BusinessType.BARBERSHOP}>
                        Barbearia
                      </SelectItem>
                      <SelectItem value={BusinessType.BEAUTY_SALON}>
                        Salão de Beleza
                      </SelectItem>
                      <SelectItem value={BusinessType.DENTAL}>
                        Consultório Odontológico
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="communicationStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilos de Comunicação</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Formal, Descontraído, etc"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={addCommunicationStyle}
                        variant="secondary"
                      >
                        Adicionar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2">
                {communicationStyles.map((style) => (
                  <Badge key={style} variant="secondary">
                    {style}
                    <button
                      type="button"
                      onClick={() => removeCommunicationStyle(style)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="customRule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regras Personalizadas</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Sempre confirmar horário 2x"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={addCustomRule}
                        variant="secondary"
                      >
                        Adicionar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2">
                {customRules.map((rule) => (
                  <Badge key={rule} variant="secondary">
                    {rule}
                    <button
                      type="button"
                      onClick={() => removeCustomRule(rule)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
