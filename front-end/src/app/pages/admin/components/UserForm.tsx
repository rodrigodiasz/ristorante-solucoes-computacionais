'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserFormProps {
  onUserCreated: () => void;
}

export function UserForm({ onUserCreated }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roles = [
    { value: 'USER', label: 'Usuário' },
    { value: 'GARCOM', label: 'Garçom' },
    { value: 'COZINHA', label: 'Cozinha' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'ADMIN', label: 'Administrador' },
  ];

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (name === '' || email === '' || password === '' || selectedRole === '') {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const token = await getCookieClient();
      await api.post(
        '/users',
        {
          name,
          email,
          password,
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Usuário criado com sucesso!');
      onUserCreated();
      // Reset form by changing key to force re-render
      setFormKey(prev => prev + 1);
      setSelectedRole('');
    } catch (err: any) {
      console.log(err);
      const errorMessage = err.response?.data?.error || 'Erro ao criar usuário';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Cadastrar Novo Usuário
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Preencha os dados para criar uma nova conta de usuário
        </p>
      </div>

      <form key={formKey} className="space-y-6" onSubmit={handleRegister}>
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nome
          </label>
          <Input
            id="name"
            className="w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
            type="text"
            placeholder="Digite o nome completo"
            required
            name="name"
            defaultValue=""
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            E-mail
          </label>
          <Input
            id="email"
            className="w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
            type="email"
            placeholder="Digite o e-mail"
            required
            name="email"
            defaultValue=""
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Senha
          </label>
          <Input
            id="password"
            className="w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
            type="password"
            placeholder="Digite a senha"
            required
            name="password"
            defaultValue=""
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="role"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Função
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600">
              <SelectValue placeholder="Selecione a função do usuário" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 transition-colors"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Criando usuário...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Criar Usuário
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
