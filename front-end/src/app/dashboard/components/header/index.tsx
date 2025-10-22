'use client';

import Link from 'next/link';
import {
  LogOutIcon,
  SettingsIcon,
  Table,
  ShoppingCart,
  ChefHat,
  Tag,
  Menu,
  Users,
  Shield,
  Package,
} from 'lucide-react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ThemeSwitch } from '@/components/ui/switch';
import { usePathname } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, isAdmin, isManager, isWaiter, isKitchen, loading } =
    useUserRole();

  async function handleLogout() {
    deleteCookie('session', { path: '/' });
    toast.success('Logout feito com sucesso!');
    router.replace('/');
  }

  async function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();

    try {
      const token = await getCookieClient();
      const response = await api.get('/permissions/first-route', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: userRole,
        },
      });

      const firstRoute = response.data.route;
      router.push(firstRoute);
    } catch (error) {
      console.error('Erro ao obter primeira rota permitida:', error);
      router.push('/dashboard/unauthorized');
    }
  }

  const isActive = (path: string) => pathname === path;

  const shouldShowLink = (linkPath: string) => {
    if (loading) return false;

    switch (userRole) {
      case 'ADMIN':
        return true; 
      case 'GERENTE':
        return linkPath !== '/dashboard/admin'; 
      case 'GARCOM':
        return ['/dashboard/table', '/dashboard/order'].includes(linkPath);
      case 'COZINHA':
        return ['/dashboard/kitchen'].includes(linkPath);
      case 'USER':
        return false; 
      default:
        return false;
    }
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="hover:opacity-80 transition-opacity"
          >
            <h1 className="text-3xl font-bold">
              <span className="text-emerald-500">Ris</span>
              <span className="text-emerald-500 dark:text-white">tora</span>
              <span className="text-emerald-500 dark:text-red-500">nte</span>
            </h1>
          </button>

          <nav className="flex items-center gap-6">
            {shouldShowLink('/dashboard/table') && (
              <Link
                href="/dashboard/table"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-2 ${
                  isActive('/dashboard/table')
                    ? 'text-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Table size={16} />
                Mesas
              </Link>
            )}
            {shouldShowLink('/dashboard/order') && (
              <Link
                href="/dashboard/order"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-2 ${
                  isActive('/dashboard/order')
                    ? 'text-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <ShoppingCart size={16} />
                Pedidos
              </Link>
            )}
            {shouldShowLink('/dashboard/kitchen') && (
              <Link
                href="/dashboard/kitchen"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-2 ${
                  isActive('/dashboard/kitchen')
                    ? 'text-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <ChefHat size={16} />
                Cozinha
              </Link>
            )}
            {shouldShowLink('/dashboard/category') && (
              <Link
                href="/dashboard/category"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-2 ${
                  isActive('/dashboard/category')
                    ? 'text-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Tag size={16} />
                Categorias
              </Link>
            )}
            {shouldShowLink('/dashboard/product') && (
              <Link
                href="/dashboard/product"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-2 ${
                  isActive('/dashboard/product')
                    ? 'text-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Menu size={16} />
                Cardápio
              </Link>
            )}
            {shouldShowLink('/dashboard/management') && (
              <Link
                href="/dashboard/management"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-2 ${
                  isActive('/dashboard/management')
                    ? 'text-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Package size={16} />
                Gerenciar
              </Link>
            )}
            {shouldShowLink('/dashboard/admin') && (
              <Link
                href="/dashboard/admin"
                className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-2 ${
                  isActive('/dashboard/admin')
                    ? 'text-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <SettingsIcon size={16} />
                Admin
              </Link>
            )}

            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <ThemeSwitch />
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-full transition-colors"
                title="Sair"
              >
                <LogOutIcon size={20} className="text-red-500" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
