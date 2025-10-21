'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { OrderItemProps } from '@/lib/order.type';

interface OrderContextData {
  isOpen: boolean;
  order: OrderItemProps[];
  onRequestOpen: (order_id: string) => Promise<void>;
  onRequestClose: () => void;
  finishOrder: (order_id: string) => Promise<void>;
  removeOrderItem: (itemId: string) => Promise<void>;
}

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderContext = createContext({} as OrderContextData);

export function OrderProvider({ children }: OrderProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<OrderItemProps[]>([]);
  const router = useRouter();

  async function onRequestOpen(order_id: string) {
    console.log('onRequestOpen chamado com order_id:', order_id);

    try {
      const token = await getCookieClient();
      console.log('Token obtido:', token);

      const response = await api.get('/order/detail', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          order_id: order_id,
        },
      });

      console.log('Resposta da API:', response.data);
      setOrder(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error('Erro ao obter os detalhes do pedido:', error);
    }
  }

  function onRequestClose() {
    console.log('onRequestClose chamado');
    setIsOpen(false);
  }

  async function finishOrder(order_id: string) {
    const token = await getCookieClient();
    const data = {
      order_id: order_id,
    };

    try {
      await api.put('/order/finish', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear the order state after finishing
      setOrder([]);
      setIsOpen(false);

      toast.success('Pedido finalizado!');
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Falha ao finalizar o pedido!');
    }
  }

  async function removeOrderItem(itemId: string) {
    try {
      const token = await getCookieClient();
      await api.delete('/order/remove', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          item_id: itemId,
        },
      });
      toast.success('Item removido!');

      // Remove item from local state immediately
      setOrder(prevOrder => prevOrder.filter(item => item.id !== itemId));

      // Refresh router to sync with server
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Falha ao remover item!');
    }
  }

  return (
    <OrderContext.Provider
      value={{
        isOpen,
        order,
        onRequestOpen,
        onRequestClose,
        finishOrder,
        removeOrderItem,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}