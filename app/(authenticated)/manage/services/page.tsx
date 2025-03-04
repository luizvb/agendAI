"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogForm } from "@/components/ui/dialog";
import { serviceApi } from "@/services";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManageServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    serviceApi.fetchServices().then((data) => setServices(data));
  }, []);

  const handleAddService = (service) => {
    serviceApi
      .createService(service)
      .then((data) => setServices((prev) => [...prev, data]));
  };

  const handleUpdateService = (id, updatedService) => {
    serviceApi
      .updateService(id, updatedService)
      .then((data) =>
        setServices((prev) =>
          prev.map((service) => (service.id === id ? data : service))
        )
      );
  };

  const handleDeleteService = (id) => {
    serviceApi
      .deleteService(id)
      .then(() =>
        setServices((prev) => prev.filter((service) => service.id !== id))
      );
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow flex flex-col p-8">
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Gerenciar Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <DialogForm triggerText="Adicionar Serviço">
              <ServiceForm onSubmit={handleAddService} />
            </DialogForm>
            <ServiceList
              services={services}
              onUpdate={handleUpdateService}
              onDelete={handleDeleteService}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ServiceForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setduration] = useState(0);
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, duration, price });
    setName("");
    setDescription("");
    setduration(0);
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome do Serviço
          </label>
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <Input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Duração (em minutos)
          </label>
          <Input
            type="number"
            placeholder="Duração (em minutos)"
            value={duration}
            onChange={(e) => setduration(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço</label>
          <Input
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Adicionar Serviço</Button>
        </div>
      </div>
    </form>
  );
}

function ServiceList({ services, onUpdate, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Duração (minutos)</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function ServiceItem({ service, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description);
  const [duration, setduration] = useState(service.duration);
  const [price, setPrice] = useState(service.price);

  const handleUpdate = () => {
    onUpdate(service.id, { name, description, duration, price });
    setIsEditing(false);
  };

  return (
    <TableRow>
      {isEditing ? (
        <>
          <TableCell>
            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2"
            />
          </TableCell>
          <TableCell>
            <Input
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-2"
            />
          </TableCell>
          <TableCell>
            <Input
              placeholder="Duração"
              value={duration}
              onChange={(e) => setduration(e.target.value)}
              className="mb-2"
            />
          </TableCell>
          <TableCell>
            <Input
              placeholder="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mb-2"
            />
          </TableCell>
          <TableCell>
            <Button onClick={handleUpdate} className="mr-2">
              Salvar
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>{service.name}</TableCell>
          <TableCell>{service.description}</TableCell>
          <TableCell>{service.duration}</TableCell>
          <TableCell>{service.price}</TableCell>
          <TableCell>
            <Button onClick={() => setIsEditing(true)} className="mr-2">
              Editar
            </Button>
            <Button variant="outline" onClick={() => onDelete(service.id)}>
              Excluir
            </Button>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
