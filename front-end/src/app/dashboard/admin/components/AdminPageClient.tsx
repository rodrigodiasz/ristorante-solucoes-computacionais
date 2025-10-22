'use client';

import { useState } from 'react';
import { UserProps } from '@/lib/order.type';
import { UsersTable } from './UsersTable';
import { PermissionsTable } from './PermissionsTable';
import { UserForm } from './UserForm';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Users, Shield, UserPlus } from 'lucide-react';

interface AdminPageClientProps {
  initialUsers: UserProps[];
  initialPermissions: Record<
    string,
    Array<{ route: string; can_access: boolean }>
  >;
}

export function AdminPageClient({
  initialUsers,
  initialPermissions,
}: AdminPageClientProps) {
  const [users, setUsers] = useState<UserProps[]>(initialUsers);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'users' | 'permissions' | 'register'
  >('users');

  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      const token = await getCookieClient();
      const response = await api.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao atualizar lista de usuários:', error);
      toast.error('Erro ao atualizar lista de usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = async () => {
    setIsLoading(true);
    try {
      const token = await getCookieClient();
      const response = await api.get('/admin/permissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPermissions(response.data);
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      toast.error('Erro ao atualizar permissões');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Painel Administrativo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie usuários e permissões do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={16} />
              Usuários
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'permissions'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield size={16} />
              Permissões
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus size={16} />
              Cadastrar Usuário
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Usuários do Sistema
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Total de usuários: {users.length}
              </p>
            </div>
            <button
              onClick={refreshUsers}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Lista'}
            </button>
          </div>
          <UsersTable users={users} onUserUpdated={refreshUsers} />
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Permissões por Role
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure quais rotas cada role pode acessar
              </p>
            </div>
            <button
              onClick={refreshPermissions}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Lista'}
            </button>
          </div>
          <PermissionsTable
            permissions={permissions}
            onPermissionUpdated={refreshPermissions}
          />
        </div>
      )}

      {activeTab === 'register' && <UserForm onUserCreated={refreshUsers} />}
    </div>
  );
}
