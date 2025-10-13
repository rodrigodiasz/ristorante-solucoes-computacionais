"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TableIcon } from "lucide-react";

export default function TableOpen() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function openOrder() {
    if (number === "") {
      toast.error("Por favor, insira o número da mesa");
      return;
    }

    setIsLoading(true);
    const token = await getCookieClient();

    try {
      // Verifica se já existe um pedido (mesa) com o mesmo número
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const orders = response.data;
      if (orders.some((order: any) => order.table === Number(number))) {
        toast.error("Mesa já cadastrada");
        return;
      }

      // Se não existir, cria o pedido (mesa)
      await api.post(
        "/order",
        {
          table: Number(number),
          name: name ? name : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Mesa aberta com sucesso");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao abrir mesa");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto max-w-2xl px-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6 mx-auto w-fit">
            <TableIcon className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Abrir Mesa
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">
            Crie um novo pedido para uma mesa
          </p>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="number"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Número da Mesa
            </label>
            <Input
              id="number"
              type="number"
              placeholder="Ex: 1, 2, 3..."
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nome do Cliente (Opcional)
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Nome do cliente"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={isLoading}
            >
              Voltar
            </Button>
            <Button
              onClick={openOrder}
              disabled={isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              {isLoading ? "Abrindo..." : "Abrir Mesa"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

