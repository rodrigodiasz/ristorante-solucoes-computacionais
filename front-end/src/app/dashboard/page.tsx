import { api } from '@/services/api';
import { getCookieServer } from '@/lib/cookieServer';
import { OrderProps } from '@/lib/order.type';
import { Orders } from './components/orders/page';

async function getOrders(): Promise<OrderProps[] | []> {
  try {
    const token = await getCookieServer();
    const response = await api.get('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default async function Dashboard() {
  const orders = await getOrders();
  return (
    <>
      <main className="container mx-auto p-5 min-h-screen">
        <Orders orders={orders} />
      </main>
    </>
  );
}
