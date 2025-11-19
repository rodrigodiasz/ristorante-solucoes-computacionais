'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { OrderContext } from '@/providers/order';
import { OrderProps } from '@/lib/order.type';
import { RefreshCw, ShoppingCart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
    toast.success('Pedidos atualizados!');
  }

  function handleAddItems(order: OrderProps) {
    // Navigate to order page with the order_id and table number
    router.push(`/dashboard/order?order_id=${order.id}&number=${order.table}`);
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
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} ativos
          </span>
        </section>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
              <ShoppingCart className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              Nenhum pedido ativo
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Abra uma mesa para começar a receber pedidos
            </p>
            <button
              onClick={() => router.push('/dashboard/table')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Abrir Mesa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDetailOrder(order.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      Mesa {order.table}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Ativo
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                      Cliente:
                    </span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {order.name || 'Não informado'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-2">
                  <button
                    onClick={() => handleDetailOrder(order.id)}
                    className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Ver detalhes →
                  </button>
                  {order.draft && (
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        handleAddItems(order);
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Plus size={14} className="mr-1" />
                      Adicionar Itens
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}