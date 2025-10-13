"use client";
import { useContext } from "react";
import { RefreshCw } from "lucide-react";
import { OrderProps } from "@/lib/order.type";
import { Modal } from "../modal";
import { OrderContext } from "@/providers/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  orders: OrderProps[];
}

export function Orders({ orders }: Props) {
  const { isOpen, onRequestOpen } = useContext(OrderContext);
  const router = useRouter();

  async function handleDetailOrder(order_id: string) {
    await onRequestOpen(order_id);
  }
  function handleRefresh() {
    router.refresh();
    toast.success("Pedidos atualizados!");
  }
  return (
    <>
      <main className="flex flex-col gap-8 mt-20 items-center px-4 max-w-4xl mx-auto w-full">
        <section className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl text-zinc-900 dark:text-white font-bold">
              Pedidos
            </h1>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
              title="Atualizar pedidos"
            >
              <RefreshCw size={24} className="text-emerald-500" />
            </button>
          </div>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} ativos
          </span>
        </section>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-lg text-zinc-500 dark:text-zinc-400">
              Nenhum pedido aberto no momento.
            </span>
            <span className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
              Os pedidos aparecerão aqui quando forem criados.
            </span>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {orders.map((order) => (
              <button
                key={order.id}
                className="group relative dark:bg-zinc-800 bg-white w-full flex items-center gap-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-zinc-200 dark:border-zinc-700"
                onClick={() => handleDetailOrder(order.id)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 rounded-l-lg"></div>
                <div className="flex flex-col items-start gap-1 ml-2">
                  <span className="text-lg font-semibold dark:text-white text-zinc-900">
                    Mesa {order.table}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Clique para ver detalhes
                  </span>
                </div>
              </button>
            ))}
          </section>
        )}
      </main>
      {isOpen && <Modal />}
    </>
  );
}
