"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { clientApi } from "@/services/clientService";
import { Client, CreateClientDTO } from "@/types/client";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<CreateClientDTO>({
    name: "",
    phoneNumber: "",
    email: "",
    notificationsEnabled: true,
  });

  const fetchClients = async () => {
    try {
      const data = await clientApi.list();
      setClients(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await clientApi.create(formData);
      await fetchClients();
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
      setIsCreateOpen(false);
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        notificationsEnabled: true,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar cliente",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      await clientApi.update(selectedClient.id, formData);
      await fetchClients();
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
      setIsEditOpen(false);
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        notificationsEnabled: true,
      });
      setSelectedClient(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow flex flex-col p-8">
        <Card className="w-full mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Clientes</CardTitle>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Cliente</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Telefone</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={formData.notificationsEnabled}
                        onCheckedChange={(checked: boolean) =>
                          setFormData({
                            ...formData,
                            notificationsEnabled: checked,
                          })
                        }
                      />
                      <Label htmlFor="notifications">
                        Permitir notificações
                      </Label>
                    </div>
                    <Button type="submit" className="w-full">
                      Criar Cliente
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Notificações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.phoneNumber}</TableCell>
                      <TableCell>{client.email || "-"}</TableCell>
                      <TableCell>
                        {client.notificationsEnabled
                          ? "Ativadas"
                          : "Desativadas"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedClient(client);
                            setFormData({
                              name: client.name,
                              phoneNumber: client.phoneNumber,
                              email: client.email || "",
                              notificationsEnabled: client.notificationsEnabled,
                            });
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phoneNumber">Telefone</Label>
                <Input
                  id="edit-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-notifications"
                  checked={formData.notificationsEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, notificationsEnabled: checked })
                  }
                />
                <Label htmlFor="edit-notifications">
                  Permitir notificações
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Atualizar Cliente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
