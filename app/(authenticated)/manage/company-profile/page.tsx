"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationService } from "@/services/organizationService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { Textarea } from "@/components/ui/textarea";

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

interface CompanyProfile {
  name: string;
  description: string;
  businessHours: BusinessHours;
}

export default function ManageCompanyProfile() {
  const { organization } = useOrganization();
  const [profile, setProfile] = useState<CompanyProfile>({
    name: "",
    description: "",
    businessHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: { open: "", close: "" },
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!organization) return;

    setIsLoading(true);

    // Converter o formato dos horários de funcionamento
    const convertedBusinessHours = Object.entries(
      organization.businessHours || {}
    ).reduce((acc, [day, hours]) => {
      if (!hours) {
        acc[day] = { open: "", close: "" };
      } else {
        acc[day] = {
          open: hours.start || "",
          close: hours.end || "",
        };
      }
      return acc;
    }, {} as Record<string, { open: string; close: string }>);

    setProfile({
      name: organization.name ?? "",
      description: organization.description ?? "",
      businessHours: {
        monday: convertedBusinessHours.monday ?? {
          open: "09:00",
          close: "18:00",
        },
        tuesday: convertedBusinessHours.tuesday ?? {
          open: "09:00",
          close: "18:00",
        },
        wednesday: convertedBusinessHours.wednesday ?? {
          open: "09:00",
          close: "18:00",
        },
        thursday: convertedBusinessHours.thursday ?? {
          open: "09:00",
          close: "18:00",
        },
        friday: convertedBusinessHours.friday ?? {
          open: "09:00",
          close: "18:00",
        },
        saturday: convertedBusinessHours.saturday ?? {
          open: "09:00",
          close: "18:00",
        },
        sunday: convertedBusinessHours.sunday ?? { open: "", close: "" },
      },
    });
    setIsLoading(false);
  }, [organization]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessHoursChange = (
    day: string,
    type: "open" | "close",
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [type]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) return;

    try {
      // Converter os horários de volta para o formato da API
      const convertedBusinessHours = Object.entries(
        profile.businessHours
      ).reduce((acc, [day, hours]) => {
        if (hours.open === "" && hours.close === "") {
          acc[day] = null;
        } else {
          acc[day] = {
            start: hours.open,
            end: hours.close,
          };
        }
        return acc;
      }, {} as Record<string, { start: string; end: string } | null>);

      await organizationService.updateOrganization(organization.id, {
        name: profile.name,
        description: profile.description,
        businessHours: convertedBusinessHours,
      });

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      });
    } catch (error) {
      console.error("Error updating organization:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    }
  };

  const weekDays = [
    { id: "monday", label: "Segunda-feira" },
    { id: "tuesday", label: "Terça-feira" },
    { id: "wednesday", label: "Quarta-feira" },
    { id: "thursday", label: "Quinta-feira" },
    { id: "friday", label: "Sexta-feira" },
    { id: "saturday", label: "Sábado" },
    { id: "sunday", label: "Domingo" },
  ];

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow flex flex-col p-8">
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Perfil da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome da Empresa
                </label>
                <Input
                  placeholder="Nome"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <Textarea
                  placeholder="Descrição da empresa"
                  name="description"
                  value={profile.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  Horário de Funcionamento
                </h3>
                <div className="space-y-4">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center gap-4">
                      <span className="w-32">{day.label}</span>
                      <Input
                        type="time"
                        value={profile.businessHours[day.id]?.open}
                        onChange={(e) =>
                          handleBusinessHoursChange(
                            day.id,
                            "open",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                      <span>até</span>
                      <Input
                        type="time"
                        value={profile.businessHours[day.id]?.close}
                        onChange={(e) =>
                          handleBusinessHoursChange(
                            day.id,
                            "close",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit">Salvar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
