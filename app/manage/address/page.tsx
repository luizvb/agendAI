"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogForm } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addressApi } from "@/services";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ManageAddress() {
  const [address, setAddress] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    addressApi.fetchAddress().then((data) => setAddress(data.address));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addressApi.updateAddress(address).then(() => {
      toast({
        title: "Endereço atualizado",
        description: "O endereço foi atualizado com sucesso!",
      });
    });
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow flex flex-col p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Gerenciar Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <DialogForm triggerText="Atualizar Endereço">
              <AddressForm address={address} onSubmit={handleSubmit} />
            </DialogForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddressForm({ address, onSubmit }) {
  const [newAddress, setNewAddress] = useState(address);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Input
        placeholder="Endereço"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
        className="mb-2"
      />
      <Button type="submit">Salvar Endereço</Button>
    </form>
  );
}
