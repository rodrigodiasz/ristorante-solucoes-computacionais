"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TableIcon } from "lucide-react";

export default function TableOpen() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [maxTables, setMaxTables] = useState(5);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [openTables, setOpenTables] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadSettings() {
      const token = await getCookieClient();
      try {
        // Busca configurações do restaurante
        const settingsResponse = await api.get("/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMaxTables(settingsResponse.data.max_tables || 5);

        // Busca mesas já abertas
        const ordersResponse = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const openTablesList = ordersResponse.data
          .filter((order: any) => order.draft)
          .map((order: any) => order.table);
        setOpenTables(openTablesList);
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
        toast.error("Erro ao carregar configurações");
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  async function openOrder() {
    if (number === "") {
      toast.error("Por favor, selecione o número da mesa");
      return;
    }

    setIsLoading(true);
    const token = await getCookieClient();

    try {
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
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Erro ao abrir mesa";
      toast.error(errorMessage);
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
            {loadingSettings ? (
              <Input
                disabled
                placeholder="Carregando..."
                className="w-full"
              />
            ) : (
              <Select
                value={number}
                onValueChange={setNumber}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a mesa" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxTables }, (_, i) => i + 1).map(
                    (tableNum) => {
                      const isOpen = openTables.includes(tableNum);
                      return (
                        <SelectItem
                          key={tableNum}
                          value={tableNum.toString()}
                          disabled={isOpen}
                        >
                          Mesa {tableNum}
                          {isOpen && " (Aberta)"}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectContent>
              </Select>
            )}
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

