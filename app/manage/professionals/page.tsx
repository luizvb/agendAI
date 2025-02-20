"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogForm } from "@/components/ui/dialog";
import {
  fetchProfessionals,
  addProfessional,
  updateProfessional,
  deleteProfessional,
} from "@/services/api";
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
import { Label } from "@/components/ui/label";

export default function ManageProfessionals() {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    fetchProfessionals().then((data) => setProfessionals(data));
  }, []);

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

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow flex flex-col p-8">
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
      </div>
    </div>
  );
}

function ProfessionalForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [color, setColor] = useState("#000000");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, expertise, color });
    setName("");
    setExpertise("");
    setColor("#000000");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Profissional</Label>
        <Input
          id="name"
          placeholder="Digite o nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expertise">Especialidade</Label>
        <Input
          id="expertise"
          placeholder="Digite a especialidade"
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor de identificação</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-full"
        />
      </div>

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
          <TableHead>Cor</TableHead>
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
  const [color, setColor] = useState(professional.color || "#000000");

  const handleUpdate = () => {
    onUpdate(professional.id, { name, expertise, color });
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
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mb-2 h-10 w-full"
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
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: professional.color }}
            />
          </TableCell>
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
