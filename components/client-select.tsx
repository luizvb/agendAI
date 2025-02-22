"use client";

import { Client } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface ClientSelectProps {
  value?: number;
  onChange: (clientId: number) => void;
  clients: Client[];
}

export function ClientSelect({ value, onChange, clients }: ClientSelectProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2 items-center">
      <Select
        value={value?.toString()}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Selecione um cliente" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id.toString()}>
              {client.name} - {client.phoneNumber}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push("/clients/new")}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
