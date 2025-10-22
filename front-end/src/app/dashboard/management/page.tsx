import { api } from '@/services/api';
import { getCookieServer } from '@/lib/cookieServer';
import { CategoryProps, ProductProps } from '@/lib/order.type';
import { ManagementClient } from './components/ManagementClient';

async function getCategories(): Promise<CategoryProps[] | []> {
  try {
    const token = await getCookieServer();
    const response = await api.get('/categories', {
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

async function getProducts(): Promise<ProductProps[] | []> {
  try {
    const token = await getCookieServer();
    const response = await api.get('/products', {
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

export default async function ManagementPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <ManagementClient
      initialCategories={categories}
      initialProducts={products}
    />
  );
}
