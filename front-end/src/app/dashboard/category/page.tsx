'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Category() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRegisterCategory(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      const token = await getCookieClient();

      await api.post(
        '/categories',
        { name: name.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Categoria cadastrada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error('Falha ao cadastrar categoria!');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
          <TagIcon className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Nova Categoria
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Adicione uma nova categoria para organizar seus produtos
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <form
          className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 transition-colors"
          onSubmit={handleRegisterCategory}
        >
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nome da Categoria
            </label>
            <Input
              id="name"
              className="w-full dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 transition-colors"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
              disabled={isLoading}
              required
            />
          </div>

          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 transition-colors"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar Categoria'}
          </Button>
        </form>
      </div>
    </main>
  );
}
