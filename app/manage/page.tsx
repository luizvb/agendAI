"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/sidebar-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DialogForm } from "@/components/ui/dialog";
import {
  fetchServices,
  fetchProfessionals,
  fetchAddress,
  addService,
  updateService,
  deleteService,
  addProfessional,
  updateProfessional,
  deleteProfessional,
  updateAddress,
} from "@/services/api";

export default function Manage() {
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchServices().then((data) => setServices(data));
    fetchProfessionals().then((data) => setProfessionals(data));
    fetchAddress().then((data) => setAddress(data.address));
  }, []);

  const handleAddService = (service) => {
    addService(service).then((data) => setServices((prev) => [...prev, data]));
  };

  const handleUpdateService = (id, updatedService) => {
    updateService(id, updatedService).then((data) =>
      setServices((prev) =>
        prev.map((service) => (service.id === id ? data : service))
      )
    );
  };

  const handleDeleteService = (id) => {
    deleteService(id).then(() =>
      setServices((prev) => prev.filter((service) => service.id !== id))
    );
  };

  const handleAddProfessional = (professional) => {
    addProfessional(professional).then((data) =>
      setProfessionals((prev) => [...prev, data])
    );
  };

  const handleUpdateProfessional = (id, updatedProfessional) => {
    updateProfessional(id, updatedProfessional).then((data) =>
      setProfessionals((prev) =>
        prev.map((professional) =>
          professional.id === id ? data : professional
        )
      )
    );
  };

  const handleDeleteProfessional = (id) => {
    deleteProfessional(id).then(() =>
      setProfessionals((prev) =>
        prev.filter((professional) => professional.id !== id)
      )
    );
  };

  const handleUpdateAddress = (newAddress) => {
    updateAddress(newAddress).then((data) => setAddress(data.address));
  };

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
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
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Gerenciar Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <DialogForm triggerText="Adicionar Profissional">
              <ProfessionalForm onSubmit={handleAddProfessional} />
            </DialogForm>
            <ProfessionalList
              professionals={professionals}
              onUpdate={handleUpdateProfessional}
              onDelete={handleDeleteProfessional}
            />
          </CardContent>
        </Card>
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

function ServiceForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, duration, price });
    setName("");
    setDescription("");
    setDuration("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Duração"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="mb-2"
      />
      <Button type="submit">Adicionar Serviço</Button>
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
          <TableHead>Duração</TableHead>
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
  const [duration, setDuration] = useState(service.duration);
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
              onChange={(e) => setDuration(e.target.value)}
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

function ProfessionalForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, expertise });
    setName("");
    setExpertise("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Especialidade"
        value={expertise}
        onChange={(e) => setExpertise(e.target.value)}
        className="mb-2"
      />
      <Button type="submit">Adicionar Profissional</Button>
    </form>
  );
}

function ProfessionalList({ professionals, onUpdate, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Especialidade</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {professionals.map((professional) => (
          <ProfessionalItem
            key={professional.id}
            professional={professional}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function ProfessionalItem({ professional, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(professional.name);
  const [expertise, setExpertise] = useState(professional.expertise);

  const handleUpdate = () => {
    onUpdate(professional.id, { name, expertise });
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
              placeholder="Especialidade"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
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
          <TableCell>{professional.name}</TableCell>
          <TableCell>{professional.expertise}</TableCell>
          <TableCell>
            <Button onClick={() => setIsEditing(true)} className="mr-2">
              Editar
            </Button>
            <Button variant="outline" onClick={() => onDelete(professional.id)}>
              Excluir
            </Button>
          </TableCell>
        </>
      )}
    </TableRow>
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
