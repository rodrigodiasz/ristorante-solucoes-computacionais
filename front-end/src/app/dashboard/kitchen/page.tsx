import { api } from '@/services/api';
import { getCookieServer } from '@/lib/cookieServer';
import { OrderProps } from '@/lib/order.type';
import { KitchenOrders } from './components/KitchenOrders';

async function getOrders(): Promise<OrderProps[] | []> {
  try {
    const token = await getCookieServer();
    const response = await api.get('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.filter(
      (order: OrderProps) => !order.draft && !order.status
    );
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default async function KitchenPage() {
  const orders = await getOrders();

  return (
    <div className="container mx-auto p-5 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Cozinha
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visualize os pedidos para preparação
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Pedidos para Preparação
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {orders.length > 0
              ? `${orders.length} pedido${
                  orders.length > 1 ? 's' : ''
                } aguardando preparação`
              : 'Nenhum pedido aguardando preparação'}
          </p>
        </div>

        <KitchenOrders orders={orders} />
      </div>
    </div>
  );
}
