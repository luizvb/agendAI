"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogForm } from "@/components/ui/dialog";
import { fetchAddress, updateAddress } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManageAddress() {
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchAddress().then((data) => setAddress(data.address));
  }, []);

  const handleUpdateAddress = (newAddress) => {
    updateAddress(newAddress).then((data) => setAddress(data.address));
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
              <AddressForm address={address} onSubmit={handleUpdateAddress} />
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
