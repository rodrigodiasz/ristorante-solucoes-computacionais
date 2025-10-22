'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface PermissionsTableProps {
  permissions: Record<string, Array<{ route: string; can_access: boolean }>>;
  onPermissionUpdated: () => void;
}

const roleLabels = {
  ADMIN: 'Administrador',
  USER: 'Usuário',
  GARCOM: 'Garçom',
  COZINHA: 'Cozinha',
  GERENTE: 'Gerente',
};

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/dashboard/table': 'Mesas',
  '/dashboard/order': 'Pedidos',
  '/dashboard/category': 'Categorias',
  '/dashboard/product': 'Cardápio',
  '/dashboard/kitchen': 'Cozinha',
  '/dashboard/admin': 'Admin',
};

export function PermissionsTable({
  permissions,
  onPermissionUpdated,
}: PermissionsTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handlePermissionChange = async (
    role: string,
    route: string,
    canAccess: boolean
  ) => {
    const permissionKey = `${role}-${route}`;
    setUpdating(permissionKey);

    try {
      const token = await getCookieClient();
      await api.put(
        '/admin/permissions',
        {
          role,
          route,
          can_access: canAccess,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Permissão atualizada com sucesso!');
      onPermissionUpdated();
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error);
      toast.error('Erro ao atualizar permissão');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeVariant = (
    role: string
  ): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'outline' | 'destructive'
    > = {
      ADMIN: 'default',
      GERENTE: 'default',
      GARCOM: 'secondary',
      COZINHA: 'secondary',
      USER: 'outline',
    };
    return variants[role] || 'outline';
  };

  if (Object.keys(permissions).length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma permissão encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          As permissões serão carregadas em breve
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            {Object.keys(routeLabels).map(route => (
              <th
                key={route}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {routeLabels[route as keyof typeof routeLabels]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(permissions).map(([role, rolePermissions]) => (
            <tr key={role} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getRoleBadgeVariant(role)}>
                  {roleLabels[role as keyof typeof roleLabels]}
                </Badge>
              </td>
              {Object.keys(routeLabels).map(route => {
                const permission = rolePermissions.find(p => p.route === route);
                const canAccess = permission?.can_access ?? false;
                const permissionKey = `${role}-${route}`;

                return (
                  <td
                    key={route}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <div className="flex justify-center">
                      <Switch
                        checked={canAccess}
                        onCheckedChange={checked =>
                          handlePermissionChange(role, route, checked)
                        }
                        disabled={updating === permissionKey}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
