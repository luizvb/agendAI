"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCompanyProfile, updateCompanyProfile } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManageCompanyProfile() {
  const [profile, setProfile] = useState({
    logo: "",
    name: "",
    address: "",
    workingHours: "",
  });

  useEffect(() => {
    fetchCompanyProfile().then((data) => setProfile(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompanyProfile(profile).then((data) => setProfile(data));
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow flex flex-col p-8">
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Perfil da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Logo URL"
                name="logo"
                value={profile.logo}
                onChange={handleChange}
                className="mb-2"
              />
              <Input
                placeholder="Nome"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mb-2"
              />
              <Input
                placeholder="Endereço"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="mb-2"
              />
              <Input
                placeholder="Horário de Funcionamento"
                name="workingHours"
                value={profile.workingHours}
                onChange={handleChange}
                className="mb-2"
              />
              <Button type="submit">Salvar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
