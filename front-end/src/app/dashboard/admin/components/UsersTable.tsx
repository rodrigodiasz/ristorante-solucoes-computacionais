'use client';

import { useState } from 'react';
import { UserProps } from '@/lib/order.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import { RoleChangeModal } from './RoleChangeModal';

interface UsersTableProps {
  users: UserProps[];
  onUserUpdated?: () => void;
}

export function UsersTable({ users, onUserUpdated }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getRoleBadgeText = (role: string) => {
    const labels = {
      ADMIN: 'Administrador',
      USER: 'Usuário',
      GARCOM: 'Garçom',
      COZINHA: 'Cozinha',
      GERENTE: 'Gerente',
    };
    return labels[role as keyof typeof labels] || role;
  };

  const handleEditRole = (user: UserProps) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChanged = () => {
    if (onUserUpdated) {
      onUserUpdated();
    }
  };

  const renderTable = () => {
    if (users.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum usuário encontrado
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
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleBadgeText(user.role)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRole(user)}
                    className="flex items-center gap-1"
                  >
                    <EditIcon size={14} />
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {renderTable()}
      <RoleChangeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        onRoleChanged={handleRoleChanged}
      />
    </>
  );
}
