"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { organizationService } from "@/services/organizationService";
import { Check, Clock, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Service {
  name: string;
  price: number;
  duration: number;
}

interface BusinessHours {
  start: string;
  end: string;
}

type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface BusinessHoursWeek {
  [key: string]: BusinessHours | null;
}

interface Professional {
  name: string;
  role: string;
  specialties: string[];
  color: string;
}

interface FormData {
  name: string;
  description: string;
  contact: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  services: Service[];
  businessHours: BusinessHoursWeek;
  professionals: Professional[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    contact: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
    services: [
      {
        name: "Corte de Cabelo",
        price: 50,
        duration: 30,
      },
      {
        name: "Corte de Barba",
        price: 30,
        duration: 30,
      },
      {
        name: "Modelagem",
        price: 20,
        duration: 30,
      },
      {
        name: "Combo Cabelo e Barba",
        price: 70,
        duration: 60,
      },
    ],
    businessHours: {
      monday: { start: "09:00", end: "18:00" },
      tuesday: { start: "09:00", end: "18:00" },
      wednesday: { start: "09:00", end: "18:00" },
      thursday: { start: "09:00", end: "18:00" },
      friday: { start: "09:00", end: "18:00" },
      saturday: { start: "09:00", end: "14:00" },
      sunday: null,
    },
    professionals: [],
  });

  const [newService, setNewService] = useState<Service>({
    name: "",
    price: 0,
    duration: 30,
  });

  const [newProfessional, setNewProfessional] = useState<Professional>({
    name: "",
    role: "Barbeiro",
    specialties: [],
    color: "#6366f1",
  });

  const [editingService, setEditingService] = useState<{
    index: number;
    service: Service;
  } | null>(null);

  const steps = [
    {
      title: "Sobre o seu negócio",
      description: "Começando a conhecer melhor o seu negócio",
      completed: step > 1,
      current: step === 1,
    },
    {
      title: "Localização",
      description: "Com seu endereço, ajudamos a encontrarem você",
      completed: step > 2,
      current: step === 2,
    },
    {
      title: "Serviços",
      description: "Defina preços, tempo de trabalho para os seus serviços",
      completed: step > 3,
      current: step === 3,
    },
    {
      title: "Profissionais",
      description: "Adicione os profissionais do seu negócio",
      completed: step > 4,
      current: step === 4,
    },
    {
      title: "Expediente",
      description: "Configure os seus horários de atendimento",
      completed: step > 5,
      current: step === 5,
    },
  ];

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          toast.error("Nome do negócio é obrigatório");
          return false;
        }
        if (!formData.contact.trim()) {
          toast.error("Telefone de contato é obrigatório");
          return false;
        }
        return true;

      case 2:
        if (
          !formData.address.zipCode ||
          formData.address.zipCode.length !== 8
        ) {
          toast.error("CEP é obrigatório");
          return false;
        }
        if (!formData.address.number) {
          toast.error("Número é obrigatório");
          return false;
        }
        return true;

      case 3:
        if (formData.services.length === 0) {
          toast.error("Adicione pelo menos um serviço");
          return false;
        }
        return true;

      case 4:
        if (formData.professionals.length === 0) {
          toast.error("Adicione pelo menos um profissional");
          return false;
        }
        return true;

      case 5:
        const hasAnyBusinessHour = Object.values(formData.businessHours).some(
          (hours) => hours !== null
        );
        if (!hasAnyBusinessHour) {
          toast.error("Configure pelo menos um horário de funcionamento");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (!validateStep()) return;

    try {
      setIsLoading(true);
      const { contact, ...rest } = formData;

      const payload = {
        ...rest,
        contact: {
          phone: contact,
        },
        plan: "trial",
      };

      await organizationService.createOrganization(payload);
      toast.success("Organização criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar organização:", error);
      toast.error("Erro ao criar organização");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const handleAddService = () => {
    if (newService.name && newService.price > 0) {
      setFormData({
        ...formData,
        services: [...formData.services, newService],
      });
      setNewService({ name: "", price: 0, duration: 30 });
    }
  };

  const handleEditService = (index: number) => {
    setEditingService({ index, service: { ...formData.services[index] } });
  };

  const handleUpdateService = () => {
    if (editingService) {
      const updatedServices = [...formData.services];
      updatedServices[editingService.index] = editingService.service;
      setFormData({
        ...formData,
        services: updatedServices,
      });
      setEditingService(null);
    }
  };

  const handleAddProfessional = () => {
    if (newProfessional.name) {
      setFormData({
        ...formData,
        professionals: [...formData.professionals, { ...newProfessional }],
      });
      setNewProfessional({
        name: "",
        role: "Barbeiro",
        specialties: [],
        color: "#6366f1",
      });
    }
  };

  const handleRemoveProfessional = (index: number) => {
    setFormData({
      ...formData,
      professionals: formData.professionals.filter((_, i) => i !== index),
    });
  };

  const handleUpdateBusinessHours = (
    day: WeekDay,
    field: "start" | "end",
    value: string
  ) => {
    const currentHours = formData.businessHours[day];
    setFormData({
      ...formData,
      businessHours: {
        ...formData.businessHours,
        [day]: currentHours
          ? { ...currentHours, [field]: value }
          : { start: "09:00", end: "18:00" },
      },
    });
  };

  const fetchAddressByCep = async (cep: string) => {
    try {
      setIsLoading(true);
      const cleanCep = cep.replace(/\D/g, "");
      if (cleanCep.length !== 8) return;

      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setFormData({
        ...formData,
        address: {
          ...formData.address,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          zipCode: cleanCep,
        },
      });
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        zipCode: cep,
      },
    });

    if (cep.length === 8) {
      fetchAddressByCep(cep);
    }
  };

  const weekDayTranslations: { [key: string]: string } = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Sobre o seu negócio</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do seu negócio</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Barbearia Style"
                />
              </div>
              <div>
                <Label htmlFor="contact">Telefone de contato</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 11) {
                      const formattedValue = value
                        .replace(/(\d{2})(\d)/, "($1) $2")
                        .replace(/(\d{5})(\d)/, "$1-$2");
                      setFormData({ ...formData, contact: formattedValue });
                    }
                  }}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Conte um pouco sobre seu negócio..."
                  rows={4}
                />
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Localização</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={handleCepChange}
                  placeholder="Digite apenas números"
                  maxLength={8}
                />
              </div>
              {formData.address.street && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        value={formData.address.street}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={formData.address.number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              number: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={formData.address.complement}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            complement: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.address.neighborhood}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </>
              )}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-2">Serviços</h2>
            <p className="text-muted-foreground mb-6">
              Defina os serviços oferecidos pelo seu negócio
            </p>

            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleRemoveService(index)}
                      className="text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <span>{service.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        {service.price} reais
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {service.duration} minutos
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleEditService(index)}
                      className="ml-0 md:ml-4"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}

              {editingService ? (
                <div className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="editServiceName">Nome do serviço</Label>
                      <Input
                        id="editServiceName"
                        value={editingService.service.name}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            service: {
                              ...editingService.service,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editServicePrice">Preço (R$)</Label>
                      <Input
                        id="editServicePrice"
                        type="number"
                        value={editingService.service.price}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            service: {
                              ...editingService.service,
                              price: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editServiceDuration">Duração (min)</Label>
                      <Input
                        id="editServiceDuration"
                        type="number"
                        value={editingService.service.duration}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            service: {
                              ...editingService.service,
                              duration: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleUpdateService} variant="outline">
                      Salvar alterações
                    </Button>
                    <Button
                      onClick={() => setEditingService(null)}
                      variant="ghost"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="serviceName">Nome do serviço</Label>
                      <Input
                        id="serviceName"
                        value={newService.name}
                        onChange={(e) =>
                          setNewService({ ...newService, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="servicePrice">Preço (R$)</Label>
                      <Input
                        id="servicePrice"
                        type="number"
                        value={newService.price}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceDuration">Duração (min)</Label>
                      <Input
                        id="serviceDuration"
                        type="number"
                        value={newService.duration}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            duration: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddService}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar serviço
                  </Button>
                </div>
              )}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-2">Profissionais</h2>
            <p className="text-muted-foreground mb-6">
              Adicione os profissionais do seu negócio
            </p>

            <div className="space-y-4">
              {formData.professionals.map((professional, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleRemoveProfessional(index)}
                      className="text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: professional.color }}
                      />
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {professional.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {professional.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="professionalName">Nome</Label>
                    <Input
                      id="professionalName"
                      value={newProfessional.name}
                      onChange={(e) =>
                        setNewProfessional({
                          ...newProfessional,
                          name: e.target.value,
                        })
                      }
                      placeholder="Nome do profissional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="professionalRole">Função</Label>
                    <Input
                      id="professionalRole"
                      value={newProfessional.role}
                      onChange={(e) =>
                        setNewProfessional({
                          ...newProfessional,
                          role: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="professionalColor">Cor no calendário</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          id="professionalColor"
                          type="color"
                          value={newProfessional.color}
                          onChange={(e) =>
                            setNewProfessional({
                              ...newProfessional,
                              color: e.target.value,
                            })
                          }
                          className="h-10 cursor-pointer"
                        />
                      </div>
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: newProfessional.color }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Especialidades</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Corte Masculino", "Barba", "Química", "Coloração"].map(
                        (specialty) => (
                          <button
                            key={specialty}
                            type="button"
                            onClick={() =>
                              setNewProfessional({
                                ...newProfessional,
                                specialties:
                                  newProfessional.specialties.includes(
                                    specialty
                                  )
                                    ? newProfessional.specialties.filter(
                                        (s) => s !== specialty
                                      )
                                    : [
                                        ...newProfessional.specialties,
                                        specialty,
                                      ],
                              })
                            }
                            className={`px-3 py-1 rounded-full text-sm ${
                              newProfessional.specialties.includes(specialty)
                                ? "bg-primary text-white"
                                : "bg-muted"
                            }`}
                          >
                            {specialty}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleAddProfessional}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar profissional
                </Button>
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold mb-2">Expediente</h2>
            <p className="text-muted-foreground mb-6">
              Configure os horários de funcionamento
            </p>

            <div className="space-y-6">
              {Object.entries(formData.businessHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="w-full md:w-32">
                    <Label>{weekDayTranslations[day]}</Label>
                  </div>
                  {hours ? (
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                      <div className="flex-1">
                        <Label>Abertura</Label>
                        <TimePicker
                          value={hours.start}
                          onChange={(value) =>
                            handleUpdateBusinessHours(
                              day as WeekDay,
                              "start",
                              value
                            )
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Fechamento</Label>
                        <TimePicker
                          value={hours.end}
                          onChange={(value) =>
                            handleUpdateBusinessHours(
                              day as WeekDay,
                              "end",
                              value
                            )
                          }
                        />
                      </div>
                      <div className="flex items-end pb-2">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              businessHours: {
                                ...formData.businessHours,
                                [day]: null,
                              },
                            })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          businessHours: {
                            ...formData.businessHours,
                            [day]: { start: "09:00", end: "18:00" },
                          },
                        })
                      }
                    >
                      Adicionar horário
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left side - Progress */}
      <div className="hidden md:block md:w-1/2 bg-primary p-12 text-white">
        <div className="mb-12">
          <Image
            src="/logobrancocut.png"
            alt="Logo"
            width={180}
            height={100}
            className="mb-16"
          />
          <h1 className="text-4xl font-bold mb-4">
            Poucos passos para transformar seu negócio
          </h1>
        </div>

        <div className="space-y-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  s.completed
                    ? "bg-white text-primary"
                    : s.current
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {s.completed ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <div>
                <h3 className="font-medium mb-1">{s.title}</h3>
                <p className="text-sm text-white/70">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12">
        {/* Mobile header with logo and current step */}
        <div className="md:hidden mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={80}
              className="mb-4"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  s.current
                    ? "bg-primary"
                    : s.completed
                    ? "bg-primary/70"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <h2 className="text-xl font-bold text-center">
            {steps.find((s) => s.current)?.title}
          </h2>
          <p className="text-center text-muted-foreground mt-1">
            Etapa {step} de {steps.length}
          </p>
        </div>

        <div className="w-full max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
            <button onClick={handleBack} className="text-muted-foreground">
              ← Voltar
            </button>
            <a href="#" className="text-primary">
              Precisa de ajuda? Clique aqui
            </a>
          </div>

          {renderStepContent()}

          <div className="mt-8">
            <Button
              onClick={handleNext}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Carregando..."
                : step === steps.length
                ? "Finalizar"
                : "Próximo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
