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
    start: string;
    end: string;
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
      monday: { start: "09:00", end: "18:00" },
      tuesday: { start: "09:00", end: "18:00" },
      wednesday: { start: "09:00", end: "18:00" },
      thursday: { start: "09:00", end: "18:00" },
      friday: { start: "09:00", end: "18:00" },
      saturday: { start: "09:00", end: "18:00" },
      sunday: { start: "", end: "" },
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
        acc[day] = { start: "", end: "" };
      } else {
        acc[day] = {
          start: hours.start || "",
          end: hours.end || "",
        };
      }
      return acc;
    }, {} as Record<string, { start: string; end: string }>);

    setProfile({
      name: organization.name ?? "",
      description: organization.description ?? "",
      businessHours: {
        monday: convertedBusinessHours.monday ?? {
          start: "09:00",
          end: "18:00",
        },
        tuesday: convertedBusinessHours.tuesday ?? {
          start: "09:00",
          end: "18:00",
        },
        wednesday: convertedBusinessHours.wednesday ?? {
          start: "09:00",
          end: "18:00",
        },
        thursday: convertedBusinessHours.thursday ?? {
          start: "09:00",
          end: "18:00",
        },
        friday: convertedBusinessHours.friday ?? {
          start: "09:00",
          end: "18:00",
        },
        saturday: convertedBusinessHours.saturday ?? {
          start: "09:00",
          end: "18:00",
        },
        sunday: convertedBusinessHours.sunday ?? { start: "", end: "" },
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
    type: "start" | "end",
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
        if (hours.start === "" && hours.end === "") {
          acc[day] = null;
        } else {
          acc[day] = {
            start: hours.start,
            end: hours.end,
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
                        value={profile.businessHours[day.id]?.start}
                        onChange={(e) =>
                          handleBusinessHoursChange(
                            day.id,
                            "start",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                      <span>até</span>
                      <Input
                        type="time"
                        value={profile.businessHours[day.id]?.end}
                        onChange={(e) =>
                          handleBusinessHoursChange(
                            day.id,
                            "end",
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
