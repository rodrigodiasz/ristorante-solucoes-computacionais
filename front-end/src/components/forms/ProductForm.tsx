"use client";

import { useState, useEffect } from "react";
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
import { api, Category } from "@/services/api";

export function ProductForm() {
  const [formData, setFormData] = useState({
    name: "", 
    price: "",
    description: "",
    banner: "",
    category_id: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.get("/api/categories");
        setCategories(data.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erro ao carregar categorias",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Nome do produto é obrigatório" });
      return;
    }

    if (!formData.price.trim()) {
      setMessage({ type: "error", text: "Preço do produto é obrigatório" });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Descrição do produto é obrigatória" });
      return;
    }

    if (!formData.category_id) {
      setMessage({ type: "error", text: "Categoria do produto é obrigatória" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/api/products", formData);
      setMessage({ type: "success", text: "Produto criado com sucesso!" });
      setFormData({
        name: "",
        price: "",
        description: "",
        banner: "",
        category_id: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao criar produto",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Cadastrar Produto</CardTitle>
        <CardDescription>Adicione um novo produto ao cardápio</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Pizza Margherita"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="text"
              placeholder="Ex: 29.90"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Pizza com molho de tomate, mussarela e manjericão"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">URL da Imagem</Label>
            <Input
              id="banner"
              type="text"
              placeholder="Ex: https://exemplo.com/imagem.jpg"
              value={formData.banner}
              onChange={(e) => handleInputChange("banner", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => handleInputChange("category_id", e.target.value)}
              disabled={loading || loadingCategories}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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

          <Button
            type="submit"
            disabled={loading || loadingCategories}
            className="w-full"
          >
            {loading ? "Criando..." : "Criar Produto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
