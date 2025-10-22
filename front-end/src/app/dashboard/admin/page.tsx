import { api } from '@/services/api';
import { getCookieServer } from '@/lib/cookieServer';
import { UserProps } from '@/lib/order.type';
import { AdminPageClient } from './components/AdminPageClient';

async function getUsers(): Promise<UserProps[] | []> {
  try {
    const token = await getCookieServer();
    const response = await api.get('/admin/users', {
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

async function getPermissions(): Promise<
  Record<string, Array<{ route: string; can_access: boolean }>> | {}
> {
  try {
    const token = await getCookieServer();
    const response = await api.get('/admin/permissions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return {};
  }
}

export default async function AdminPage() {
  const [users, permissions] = await Promise.all([
    getUsers(),
    getPermissions(),
  ]);

  return (
    <AdminPageClient initialUsers={users} initialPermissions={permissions} />
  );
}
