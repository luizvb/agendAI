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

export default function ManageCompanyProfile() {
  const { organization } = useOrganization();
  const [profile, setProfile] = useState({
    name: "",
    description: "",
    logoUrl: "",
    businessHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: { open: "", close: "" },
    } as BusinessHours,
  });
  const { toast } = useToast();
  const organizationId = localStorage.getItem("organization-id");

  useEffect(() => {
    organizationService.getOrganization(organizationId).then((data) => {
      setProfile({
        name: data.name || "",
        description: data.description || "",
        logoUrl: data.logoUrl || "",
        businessHours: data.businessHours || profile.businessHours,
      });
    });
  }, []);

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

    try {
      await organizationService.updateOrganization(
        localStorage.getItem("organization-id"),
        {
          name: profile.name,
          description: profile.description,
          logoUrl: profile.logoUrl,
          businessHours: profile.businessHours,
        }
      );
      toast({
        title: "Perfil atualizado",
        description: "O perfil da empresa foi atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil da empresa.",
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
                  Logo URL
                </label>
                <Input
                  placeholder="URL do logo"
                  name="logoUrl"
                  value={profile.logoUrl}
                  onChange={handleChange}
                />
              </div>

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
