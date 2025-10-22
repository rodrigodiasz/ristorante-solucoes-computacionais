'use client';

import { useState, useEffect } from 'react';
import { UserProps } from '@/lib/order.type';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps | null;
  onUserUpdated: () => void;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Atualizar os campos quando o usuário selecionado mudar
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword('');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name && !email && !password) {
      toast.error('Preencha pelo menos um campo');
      return;
    }

    setIsLoading(true);

    try {
      const token = await getCookieClient();
      await api.put(
        `/admin/users/${user.id}`,
        {
          name: name || undefined,
          email: email || undefined,
          password: password || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Usuário atualizado com sucesso!');
      onUserUpdated();
      onClose();
      setPassword('');
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err.response?.data?.error || 'Erro ao atualizar usuário';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      return;
    }

    setIsLoading(true);

    try {
      const token = await getCookieClient();
      await api.delete(`/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Usuário excluído com sucesso!');
      onUserUpdated();
      onClose();
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err.response?.data?.error || 'Erro ao excluir usuário';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar Usuário
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome
            </label>
            <Input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite o nome completo"
              className="w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail
            </label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Digite o novo e-mail"
              className="w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a nova senha (deixe vazio para não alterar)"
              className="w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir Usuário'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
