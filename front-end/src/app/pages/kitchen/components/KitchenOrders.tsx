'use client';

import { useState, useEffect } from 'react';
import { OrderProps, OrderItemProps } from '@/lib/order.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';

interface KitchenOrdersProps {
  orders: OrderProps[];
}

export function KitchenOrders({ orders }: KitchenOrdersProps) {
  const [orderItems, setOrderItems] = useState<
    Record<string, OrderItemProps[]>
  >({});
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadAllOrderItems = async () => {
      for (const order of orders) {
        if (!orderItems[order.id] && !order.draft) {
          await loadOrderItems(order.id);
        }
      }
    };

    loadAllOrderItems();
  }, [orders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (order: OrderProps) => {
    if (order.draft) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <ClockIcon size={12} />
          Rascunho
        </Badge>
      );
    }

    if (order.status) {
      return (
        <Badge
          variant="default"
          className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600"
        >
          <CheckCircleIcon size={12} />
          Finalizado
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertCircleIcon size={12} />
        Em Preparação
      </Badge>
    );
  };

  const getPriorityColor = (order: OrderProps) => {
    if (order.draft) return 'border-gray-200 dark:border-gray-700';
    if (order.status)
      return 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800';
    return 'border-emerald-200 bg-white dark:bg-gray-800 dark:border-gray-700';
  };

  const toggleItemComplete = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const loadOrderItems = async (orderId: string) => {
    setLoadingItems(prev => new Set(prev).add(orderId));

    try {
      const token = await getCookieClient();
      const response = await api.get('/order/detail', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          order_id: orderId,
        },
      });

      setOrderItems(prev => ({
        ...prev,
        [orderId]: response.data,
      }));
    } catch (error) {
      console.error('Erro ao carregar itens do pedido:', error);
      toast.error('Erro ao carregar itens do pedido');
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum pedido aguardando preparação
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Todos os pedidos foram preparados ou não há pedidos ativos
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map(order => (
        <div
          key={order.id}
          className={`border rounded-lg p-6 transition-all hover:shadow-md ${getPriorityColor(
            order
          )}`}
        >
          {/* Header do pedido */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Mesa {order.table}
              </h3>
              {order.name && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cliente: {order.name}
                </p>
              )}
            </div>
            {getStatusBadge(order)}
          </div>

          {/* Informações do pedido */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pedido:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                #{order.id.slice(-8)}
              </span>
            </div>
          </div>

          {/* Itens do pedido - sempre visíveis */}
          {!order.draft && orderItems[order.id] && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
                Itens para Preparar:
              </h4>
              <div className="space-y-2">
                {orderItems[order.id].map(item => {
                  const isCompleted = completedItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center p-4 rounded-lg border transition-all hover:shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 opacity-75'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex-1">
                        <p
                          className={`font-medium text-sm ${
                            isCompleted
                              ? 'text-emerald-800 dark:text-emerald-200 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {item.product.name}
                        </p>
                        {item.product.description && (
                          <p
                            className={`text-xs mt-1 ${
                              isCompleted
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {item.product.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={`${
                            isCompleted
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {item.amount}x
                        </Badge>
                        <Button
                          variant={isCompleted ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleItemComplete(item.id)}
                          className={`text-xs ${
                            isCompleted
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {isCompleted ? '✓ Pronto' : 'Marcar Pronto'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading state */}
          {!order.draft && loadingItems.has(order.id) && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Carregando itens...
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
