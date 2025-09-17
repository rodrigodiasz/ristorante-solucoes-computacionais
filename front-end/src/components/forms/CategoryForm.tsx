"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/services/api";

export function CategoryForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ type: "error", text: "Nome da categoria é obrigatório" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/api/categories", { name: name.trim() });
      setMessage({ type: "success", text: "Categoria criada com sucesso!" });
      setName("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Erro ao criar categoria",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Cadastrar Categoria</CardTitle>
        <CardDescription>
          Adicione uma nova categoria para organizar os produtos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Bebidas, Pratos Principais..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Categoria"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
