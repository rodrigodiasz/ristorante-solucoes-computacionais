"use client";
import { useState, useEffect, useCallback } from "react";
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

  const loadOpenTables = useCallback(async () => {
    try {
      const token = await getCookieClient();
      const openTablesResponse = await api.get("/orders/open-tables", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const openTablesData = openTablesResponse.data || [];
      // Garante que todos os valores sejam números
      const normalizedTables = openTablesData.map((table: any) =>
        Number(table)
      );
      setOpenTables(normalizedTables);
      return normalizedTables;
    } catch (err: any) {
      console.error("Erro ao carregar mesas abertas:", err);
      return [];
    }
  }, []);

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
        await loadOpenTables();
      } catch (err: any) {
        console.error("Erro ao carregar configurações:", err);
        toast.error("Erro ao carregar configurações");
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();

    // Atualiza mesas abertas quando a página recebe foco
    const handleFocus = () => {
      if (!loadingSettings) {
        loadOpenTables();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadingSettings, loadOpenTables]);

  async function openOrder() {
    if (number === "") {
      toast.error("Por favor, selecione o número da mesa");
      return;
    }

    const tableNum = Number(number);

    // Verifica se a mesa já está aberta (garante comparação numérica)
    const isTableOpen = openTables.some(
      (openTable) => Number(openTable) === tableNum
    );
    if (isTableOpen) {
      toast.error("Esta mesa já está aberta");
      return;
    }

    setIsLoading(true);
    const token = await getCookieClient();

    try {
      // Se não existir, cria o pedido (mesa)
      await api.post(
        "/order",
        {
          table: tableNum,
          name: name ? name : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Mesa aberta com sucesso");

      // Atualiza a lista de mesas abertas imediatamente
      await loadOpenTables();

      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Erro ao abrir mesa";
      toast.error(errorMessage);
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
              <Input disabled placeholder="Carregando..." className="w-full" />
            ) : (
              <Select
                value={number}
                onValueChange={(value) => {
                  const tableNum = Number(value);
                  // Impede seleção de mesas abertas (garante comparação numérica)
                  const isTableOpen = openTables.some(
                    (openTable) => Number(openTable) === tableNum
                  );
                  if (isTableOpen) {
                    toast.error("Esta mesa já está ocupada");
                    return;
                  }
                  setNumber(value);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a mesa" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxTables }, (_, i) => i + 1).map(
                    (tableNum) => {
                      // Garante que ambos sejam números para comparação correta
                      const isOpen = openTables.some(
                        (openTable) => Number(openTable) === tableNum
                      );
                      return (
                        <SelectItem
                          key={tableNum}
                          value={tableNum.toString()}
                          disabled={isOpen}
                          className={
                            isOpen
                              ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                              : "cursor-pointer"
                          }
                        >
                          Mesa {tableNum}
                          {isOpen && " (Ocupada)"}
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
