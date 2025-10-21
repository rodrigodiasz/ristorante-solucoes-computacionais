'use client';

import { useContext, useState } from 'react';
import { OrderContext } from '@/providers/order';
import { Button } from '@/components/ui/button';
import { X, Trash2, CheckCircle, Edit, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';

export function Modal() {
  const { isOpen, order, onRequestClose, finishOrder, removeOrderItem } =
    useContext(OrderContext);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('1');
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdatedProduct, setLastUpdatedProduct] = useState<string | null>(
    null
  );

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

  function handleEditOrder() {
    setIsEditing(true);
  }

  function handleCancelEdit() {
    // Só cancela a edição do item atual, mantém o modo de edição
    setEditingProductId(null);
    setEditAmount('1');
  }

  function handleFinishEditing() {
    // Finaliza completamente o modo de edição
    setIsEditing(false);
    setEditingProductId(null);
    setEditAmount('1');
  }

  function handleEditItem(productId: string, currentAmount: number) {
    // Se já está editando outro produto, cancela a edição anterior
    if (editingProductId && editingProductId !== productId) {
      setEditingProductId(null);
      setEditAmount('1');
    }

    setEditingProductId(productId);
    setEditAmount(currentAmount.toString());
  }

  async function handleUpdateItemAmount() {
    if (!editingProductId || isUpdating) return;

    try {
      setIsUpdating(true);
      const token = await getCookieClient();
      const item = order.find(item => item.product_id === editingProductId);

      if (!item) {
        toast.error('Item não encontrado');
        return;
      }

      // Primeiro, remover o item atual
      await api.delete('/order/remove', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          item_id: item.id,
        },
      });

      // Depois, adicionar com a nova quantidade
      await api.post(
        '/order/add',
        {
          order_id: item.order_id,
          product_id: item.product_id,
          amount: Number(editAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Quantidade atualizada!');
      setLastUpdatedProduct(item.product_id);
      setEditingProductId(null);
      setEditAmount('1');

      // Refresh para atualizar os dados e manter modo de edição
      router.refresh();

      // Limpa o indicador após 2 segundos
      setTimeout(() => setLastUpdatedProduct(null), 2000);
    } catch (err) {
      console.log(err);
      toast.error('Erro ao atualizar quantidade');
      setEditingProductId(null);
      setEditAmount('1');
    } finally {
      setIsUpdating(false);
    }
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
              {order[0]?.order.name || 'Cliente não informado'}
            </p>
            {isEditing && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Modo de edição ativo
                </span>
              </div>
            )}
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
              {order.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    lastUpdatedProduct === item.product_id
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                      : 'bg-zinc-50 dark:bg-zinc-700/50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-zinc-900 dark:text-white">
                        {item.product.name}
                      </h3>
                      {lastUpdatedProduct === item.product_id && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Atualizado
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      R$ {item.product.price} x {item.amount}
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Subtotal: R${' '}
                      {(item.amount * parseFloat(item.product.price)).toFixed(
                        2
                      )}
                    </p>
                  </div>

                  {isEditing && editingProductId === item.product_id ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Editando quantidade...
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg p-1">
                          <button
                            onClick={() =>
                              setEditAmount(
                                String(Math.max(1, Number(editAmount) - 1))
                              )
                            }
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded transition-colors"
                            disabled={Number(editAmount) <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            value={editAmount}
                            onChange={e => setEditAmount(e.target.value)}
                            className="w-16 text-center text-sm bg-transparent border-none outline-none"
                            min="1"
                          />
                          <button
                            onClick={() =>
                              setEditAmount(String(Number(editAmount) + 1))
                            }
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={handleUpdateItemAmount}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-colors"
                          title="Salvar"
                        >
                          {isUpdating ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingProductId(null);
                            setEditAmount('1');
                          }}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <button
                          onClick={() =>
                            handleEditItem(item.product_id, item.amount)
                          }
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                          title="Editar quantidade"
                        >
                          <Edit size={12} className="mr-1 inline" />
                          Editar
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
                        title="Remover item"
                      >
                        <Trash2 size={12} className="mr-1 inline" />
                        Remover
                      </button>
                    </div>
                  )}
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
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleFinishEditing}
                    className="flex-1"
                  >
                    Sair da Edição
                  </Button>
                  <Button
                    onClick={handleFinishEditing}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Concluir Edição
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={onRequestClose}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={handleEditOrder}
                    variant="outline"
                    className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit size={16} className="mr-2" />
                    Editar Pedido
                  </Button>
                  <Button
                    onClick={handleFinishOrder}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Finalizar Pedido
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}