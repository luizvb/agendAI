"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

export default function SwitchCompanyPage() {
  return (
    <SessionProvider>
      <SwitchCompany />
    </SessionProvider>
  );
}

function SwitchCompany() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      if (session) {
        const data = await fetch("https://wxyeww.logto.app/oidc/me", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const response = await data.json();
        setCompanies(response.organization_data);
      }
    };

    fetchToken();
  }, [session]);

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
  };

  const handleConfirm = () => {
    if (selectedCompany) {
      // Lógica para trocar a empresa
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Trocar de Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Card
                key={company.id}
                className={`cursor-pointer min-h-[150px] ${
                  selectedCompany?.id === company.id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleCompanyChange(company)}
              >
                <CardHeader>
                  <CardTitle>{company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{company.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            onClick={handleConfirm}
            className="mt-4"
            disabled={!selectedCompany}
          >
            Confirmar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
