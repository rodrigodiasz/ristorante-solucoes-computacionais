'use client';

import React, { useState } from 'react';
import { UserProps } from '@/lib/order.type';
import { UsersTable } from './UsersTable';
import { PermissionsTable } from './PermissionsTable';
import { UserForm } from './UserForm';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Users, Shield, UserPlus, Settings } from 'lucide-react';

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
    'users' | 'permissions' | 'register' | 'settings'
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
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings size={16} />
              Configurações
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

      {activeTab === 'settings' && (
        <RestaurantSettingsPanel isLoading={isLoading} />
      )}
    </div>
  );
}

function RestaurantSettingsPanel({ isLoading }: { isLoading: boolean }) {
  const [maxTables, setMaxTables] = useState(5);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const token = await getCookieClient();
      const response = await api.get('/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMaxTables(response.data.max_tables || 5);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (maxTables < 1) {
      toast.error('O número de mesas deve ser pelo menos 1');
      return;
    }

    setSaving(true);
    try {
      const token = await getCookieClient();
      await api.put(
        '/admin/settings',
        { max_tables: maxTables },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Configurações salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      const errorMessage =
        error.response?.data?.error || 'Erro ao salvar configurações';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Configurações do Restaurante
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure o número máximo de mesas disponíveis no restaurante
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="maxTables"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Número Máximo de Mesas
            </label>
            <input
              id="maxTables"
              type="number"
              min="1"
              value={maxTables}
              onChange={(e) => setMaxTables(parseInt(e.target.value) || 1)}
              disabled={saving || isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              O garçom poderá selecionar apenas mesas de 1 a {maxTables}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving || isLoading}
              className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
