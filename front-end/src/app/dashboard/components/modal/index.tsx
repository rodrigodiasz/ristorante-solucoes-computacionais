"use client";

import { useContext } from "react";
import { OrderContext } from "@/providers/order";
import { Button } from "@/components/ui/button";
import { X, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function Modal() {
  const {
    isOpen,
    order,
    onRequestClose,
    finishOrder,
    removeOrderItem,
  } = useContext(OrderContext);

  if (!isOpen) return null;

  const total = order.reduce((sum, item) => {
    return sum + item.amount * parseFloat(item.product.price);
  }, 0);

  async function handleFinishOrder() {
    if (order.length === 0) return;
    await finishOrder(order[0].order_id);
  }

  async function handleRemoveItem(itemId: string) {
    await removeOrderItem(itemId);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Mesa {order[0]?.order.table}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {order[0]?.order.name || "Cliente não informado"}
            </p>
          </div>
          <button
            onClick={onRequestClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {order.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 dark:text-zinc-400">
                Nenhum item no pedido
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {order.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-900 dark:text-white">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      R$ {item.product.price} x {item.amount}
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Subtotal: R$ {(item.amount * parseFloat(item.product.price)).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Remover item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {order.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Total:
              </span>
              <span className="text-lg font-bold text-emerald-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onRequestClose}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                onClick={handleFinishOrder}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                <CheckCircle size={16} className="mr-2" />
                Finalizar Pedido
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

