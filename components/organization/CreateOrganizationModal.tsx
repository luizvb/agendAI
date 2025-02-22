"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { organizationService } from "@/services/organizationService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { Check, Scissors, Clock, Users, Calendar, Star } from "lucide-react";

type Step =
  | "welcome"
  | "organization"
  | "services"
  | "team"
  | "hours"
  | "trial"
  | "plan";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrganizationModal({
  isOpen,
  onClose,
}: CreateOrganizationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    plan: "trial",
    businessHours: {
      monday: { start: "09:00", end: "18:00" },
      tuesday: { start: "09:00", end: "18:00" },
      wednesday: { start: "09:00", end: "18:00" },
      thursday: { start: "09:00", end: "18:00" },
      friday: { start: "09:00", end: "18:00" },
      saturday: { start: "09:00", end: "14:00" },
      sunday: null,
    },
    services: [] as {
      name: string;
      description: string;
      duration: number;
      price: number;
    }[],
    team: [] as { name: string; role: string; color: string }[],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await organizationService.createOrganization({
        ...formData,
        trialStartDate: formData.plan === "trial" ? new Date() : undefined,
        trialEndDate:
          formData.plan === "trial"
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            : undefined,
      });

      router.refresh();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create organization"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    const steps: Step[] = [
      "welcome",
      "organization",
      "services",
      "team",
      "hours",
      "trial",
      "plan",
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = [
      "welcome",
      "organization",
      "services",
      "team",
      "hours",
      "trial",
      "plan",
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6 text-center  overflow-hidden overflow-y-auto flex flex-col">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter">
          Bem-vindo ao Seu Novo Sistema de Gestão de Atendimentos! 🚀
        </h1>
        <p className="text-muted-foreground">
          Vamos configurar seu negócio em poucos passos e você já poderá começar
          a usar!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <Calendar className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Agendamentos Simplificados</CardTitle>
            <CardDescription>
              Sistema intuitivo de agendamentos que seus clientes vão adorar
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <Users className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Gestão de Equipe</CardTitle>
            <CardDescription>
              Controle de agenda e comissões para sua equipe
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <Star className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Fidelização de Clientes</CardTitle>
            <CardDescription>
              Ferramentas para manter seus clientes sempre voltando
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <Clock className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Disponível 24/7</CardTitle>
            <CardDescription>
              Seus clientes podem agendar a qualquer momento
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Button onClick={handleNext} className="w-full">
        Começar Configuração
      </Button>
    </div>
  );

  const renderOrganizationStep = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome do seu Negócio</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ex: Studio Beauty"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Conte um pouco sobre sua barbearia..."
          rows={3}
        />
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Voltar
        </Button>
        <Button type="submit" className="flex-1">
          Próximo
        </Button>
      </div>
    </form>
  );

  const renderServicesStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Serviços Oferecidos</h3>
        <p className="text-sm text-muted-foreground">
          Adicione os serviços que sua barbearia oferece
        </p>

        {formData.services.map((service, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`service-name-${index}`}>
                    Nome do Serviço
                  </Label>
                  <Input
                    id={`service-name-${index}`}
                    value={service.name}
                    onChange={(e) => {
                      const newServices = [...formData.services];
                      newServices[index] = { ...service, name: e.target.value };
                      setFormData({ ...formData, services: newServices });
                    }}
                    placeholder="Ex: Corte de Cabelo"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`service-description-${index}`}>
                    Descrição
                  </Label>
                  <Textarea
                    id={`service-description-${index}`}
                    value={service.description}
                    onChange={(e) => {
                      const newServices = [...formData.services];
                      newServices[index] = {
                        ...service,
                        description: e.target.value,
                      };
                      setFormData({ ...formData, services: newServices });
                    }}
                    placeholder="Descreva o serviço..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-duration-${index}`}>
                    Duração (min)
                  </Label>
                  <Input
                    id={`service-duration-${index}`}
                    type="number"
                    value={service.duration}
                    onChange={(e) => {
                      const newServices = [...formData.services];
                      newServices[index] = {
                        ...service,
                        duration: Number(e.target.value),
                      };
                      setFormData({ ...formData, services: newServices });
                    }}
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-price-${index}`}>Preço (R$)</Label>
                  <Input
                    id={`service-price-${index}`}
                    type="number"
                    value={service.price}
                    onChange={(e) => {
                      const newServices = [...formData.services];
                      newServices[index] = {
                        ...service,
                        price: Number(e.target.value),
                      };
                      setFormData({ ...formData, services: newServices });
                    }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newServices = [...formData.services];
                  newServices.splice(index, 1);
                  setFormData({ ...formData, services: newServices });
                }}
                className="w-full"
              >
                Remover
              </Button>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setFormData({
              ...formData,
              services: [
                ...formData.services,
                { name: "", description: "", duration: 30, price: 0 },
              ],
            });
          }}
        >
          Adicionar Serviço
        </Button>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Próximo
        </Button>
      </div>
    </div>
  );

  const renderTeamStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sua Equipe</h3>
        <p className="text-sm text-muted-foreground">
          Adicione os profissionais da sua equipe
        </p>

        {formData.team.map((member, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`member-name-${index}`}>
                    Nome do Profissional
                  </Label>
                  <Input
                    id={`member-name-${index}`}
                    value={member.name}
                    onChange={(e) => {
                      const newTeam = [...formData.team];
                      newTeam[index] = { ...member, name: e.target.value };
                      setFormData({ ...formData, team: newTeam });
                    }}
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`member-role-${index}`}>Função</Label>
                  <Input
                    id={`member-role-${index}`}
                    value={member.role}
                    onChange={(e) => {
                      const newTeam = [...formData.team];
                      newTeam[index] = { ...member, role: e.target.value };
                      setFormData({ ...formData, team: newTeam });
                    }}
                    placeholder="Ex: Profissional"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`member-color-${index}`}>
                    Cor de Identificação
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`member-color-${index}`}
                      type="color"
                      value={member.color}
                      onChange={(e) => {
                        const newTeam = [...formData.team];
                        newTeam[index] = { ...member, color: e.target.value };
                        setFormData({ ...formData, team: newTeam });
                      }}
                      className="w-16 h-10 p-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      Escolha uma cor para identificar o profissional no
                      calendário
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newTeam = [...formData.team];
                  newTeam.splice(index, 1);
                  setFormData({ ...formData, team: newTeam });
                }}
                className="w-full"
              >
                Remover
              </Button>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setFormData({
              ...formData,
              team: [
                ...formData.team,
                { name: "", role: "", color: "#6366f1" },
              ],
            });
          }}
        >
          Adicionar Profissional
        </Button>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Próximo
        </Button>
      </div>
    </div>
  );

  const renderHoursStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Horário de Funcionamento</h3>
        <p className="text-sm text-muted-foreground">
          Configure os horários de funcionamento do seu negócio
        </p>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Segunda a Sexta</Label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label>Abertura</Label>
                  <TimePicker
                    value={formData.businessHours.monday.start}
                    onChange={(value) => {
                      const weekDays = [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                      ];
                      const updatedHours = { ...formData.businessHours };
                      weekDays.forEach((day) => {
                        updatedHours[day] = {
                          ...updatedHours[day],
                          start: value,
                        };
                      });
                      setFormData({
                        ...formData,
                        businessHours: updatedHours,
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label>Fechamento</Label>
                  <TimePicker
                    value={formData.businessHours.monday.end}
                    onChange={(value) => {
                      const weekDays = [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                      ];
                      const updatedHours = { ...formData.businessHours };
                      weekDays.forEach((day) => {
                        updatedHours[day] = {
                          ...updatedHours[day],
                          end: value,
                        };
                      });
                      setFormData({
                        ...formData,
                        businessHours: updatedHours,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Sábado</Label>
              <Select
                value={formData.businessHours.saturday ? "open" : "closed"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    businessHours: {
                      ...formData.businessHours,
                      saturday:
                        value === "open"
                          ? { start: "09:00", end: "14:00" }
                          : null,
                    },
                  })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.businessHours.saturday && (
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label>Abertura</Label>
                  <TimePicker
                    value={formData.businessHours.saturday.start}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        businessHours: {
                          ...formData.businessHours,
                          saturday: {
                            ...formData.businessHours.saturday,
                            start: value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label>Fechamento</Label>
                  <TimePicker
                    value={formData.businessHours.saturday.end}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        businessHours: {
                          ...formData.businessHours,
                          saturday: {
                            ...formData.businessHours.saturday,
                            end: value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Domingo</Label>
              <Select
                value={formData.businessHours.sunday ? "open" : "closed"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    businessHours: {
                      ...formData.businessHours,
                      sunday:
                        value === "open"
                          ? { start: "09:00", end: "14:00" }
                          : null,
                    },
                  })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.businessHours.sunday && (
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label>Abertura</Label>
                  <TimePicker
                    value={formData.businessHours.sunday.start}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        businessHours: {
                          ...formData.businessHours,
                          sunday: {
                            ...formData.businessHours.sunday,
                            start: value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label>Fechamento</Label>
                  <TimePicker
                    value={formData.businessHours.sunday.end}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        businessHours: {
                          ...formData.businessHours,
                          sunday: {
                            ...formData.businessHours.sunday,
                            end: value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Próximo
        </Button>
      </div>
    </div>
  );

  const renderTrialStep = () => (
    <div className="space-y-6">
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-primary" />
            <CardTitle>7 Dias Grátis de Premium</CardTitle>
          </div>
          <CardDescription>
            Experimente todas as funcionalidades premium por 7 dias, sem
            compromisso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-primary" />
              Agendamento online ilimitado
            </li>
            <li className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-primary" />
              Gestão completa de equipe
            </li>
            <li className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-primary" />
              Sistema de fidelidade
            </li>
            <li className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-primary" />
              Relatórios avançados
            </li>
            <li className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-primary" />
              Suporte prioritário
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Voltar
        </Button>
        <Button
          onClick={() => {
            setFormData({ ...formData, plan: "trial" });
            handleNext();
          }}
          className="flex-1"
        >
          Começar Trial Grátis
        </Button>
      </div>
    </div>
  );

  const renderPlanStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Escolha seu Plano</Label>
        <div className="grid gap-4">
          <Card
            className={cn(
              "relative cursor-pointer",
              formData.plan === "trial" && "border-2 border-primary"
            )}
          >
            <CardHeader>
              <CardTitle>Trial Premium</CardTitle>
              <CardDescription>
                7 dias grátis com todas as funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Grátis</p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "relative cursor-pointer",
              formData.plan === "basic" && "border-2 border-primary"
            )}
          >
            <CardHeader>
              <CardTitle>Plano Básico</CardTitle>
              <CardDescription>Para barbearias iniciantes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$29/mês</p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "relative cursor-pointer",
              formData.plan === "premium" && "border-2 border-primary"
            )}
          >
            <CardHeader>
              <CardTitle>Plano Premium</CardTitle>
              <CardDescription>
                Para barbearias que querem crescer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$49/mês</p>
            </CardContent>
          </Card>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Criando..." : "Finalizar"}
        </Button>
      </div>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {step === "welcome" && "Bem-vindo!"}
            {step === "organization" && "Seu Negócio"}
            {step === "services" && "Serviços"}
            {step === "team" && "Equipe"}
            {step === "hours" && "Horários"}
            {step === "trial" && "Período Gratuito"}
            {step === "plan" && "Escolha seu Plano"}
          </DialogTitle>
          <DialogDescription>
            {step === "welcome" && "Vamos começar a configurar seu negócio"}
            {step === "organization" && "Conte-nos sobre seu negócio"}
            {step === "services" && "Configure os serviços oferecidos"}
            {step === "team" && "Adicione sua equipe de profissionais"}
            {step === "hours" && "Defina seus horários de funcionamento"}
            {step === "trial" &&
              "Experimente todas as funcionalidades gratuitamente"}
            {step === "plan" && "Escolha o plano ideal para você"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {step === "welcome" && renderWelcomeStep()}
          {step === "organization" && renderOrganizationStep()}
          {step === "services" && renderServicesStep()}
          {step === "team" && renderTeamStep()}
          {step === "hours" && renderHoursStep()}
          {step === "trial" && renderTrialStep()}
          {step === "plan" && renderPlanStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
