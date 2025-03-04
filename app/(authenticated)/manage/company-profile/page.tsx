"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationService } from "@/services/organizationService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

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
  logo?: string;
}

export default function ManageCompanyProfile() {
  const { organization } = useOrganization();
  const [profile, setProfile] = useState<CompanyProfile>({
    name: "",
    description: "",
    logo: "",
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      logo: organization.logo ?? "",
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !organization?.id) return;

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const logoUrl = await organizationService.uploadLogo(
        organization.id,
        file
      );

      setProfile((prev) => ({
        ...prev,
        logo: logoUrl,
      }));

      toast({
        title: "Sucesso",
        description: "Logo enviado com sucesso",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) return;

    try {
      setIsLoading(true);
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
        logo: profile.logo,
      });

      // Update organization name in localStorage
      localStorage.setItem("organization-name", profile.name);

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
    } finally {
      setIsLoading(false);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-gray-200">
                  {profile.logo ? (
                    <Image
                      src={profile.logo}
                      alt="Logo da empresa"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Enviando..." : "Enviar Logo"}
                </Button>
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
