'use client';

import { useState } from 'react';
import { UserProps } from '@/lib/order.type';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps | null;
  onRoleChanged: () => void;
}

export function RoleChangeModal({
  isOpen,
  onClose,
  user,
  onRoleChanged,
}: RoleChangeModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async () => {
    if (!user || !selectedRole) return;

    setIsLoading(true);
    try {
      const token = await getCookieClient();
      await api.put(
        '/admin/users/role',
        {
          user_id: user.id,
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Permissão do usuário atualizada com sucesso!');
      onRoleChanged();
      onClose();
      setSelectedRole('');
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast.error('Erro ao atualizar permissão do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      ADMIN: 'Administrador',
      USER: 'Usuário',
      GARCOM: 'Garçom',
      COZINHA: 'Cozinha',
      GERENTE: 'Gerente',
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Permissão do Usuário</DialogTitle>
          <DialogDescription>
            Você está alterando a permissão de acesso de{' '}
            <strong>{user?.name}</strong> ({user?.email}).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Permissão Atual</label>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {user ? getRoleLabel(user.role) : ''}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nova Permissão</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma permissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Usuário</SelectItem>
                <SelectItem value="GARCOM">Garçom</SelectItem>
                <SelectItem value="COZINHA">Cozinha</SelectItem>
                <SelectItem value="GERENTE">Gerente</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleRoleChange}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? 'Salvando...' : 'Confirmar Alteração'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
