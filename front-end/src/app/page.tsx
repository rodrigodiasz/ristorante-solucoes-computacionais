'use client';
import Link from 'next/link';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (email === '' || password === '') {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/session', {
        email,
        password,
      });

      if (!response.data.token) {
        toast.error('Erro ao fazer login');
        return;
      }

      document.cookie = `session=${response.data.token}; path=/; max-age=${
        60 * 60 * 24 * 30
      }`;
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (err) {
      console.log(err);
      toast.error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <h1 className="text-4xl font-bold">
              <span className="text-emerald-500">Ris</span>
              <span className="text-emerald-500 dark:text-white">tora</span>
              <span className="text-emerald-500 dark:text-red-500">nte</span>
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Login
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
        </div>

        <div className="mt-8">
          <form
            className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700"
            onSubmit={handleLogin}
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                E-mail
              </label>
              <Input
                id="email"
                className="w-full dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
                type="email"
                placeholder="Digite seu e-mail"
                required
                name="email"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Senha
              </label>
              <Input
                id="password"
                className="w-full dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
                type="password"
                placeholder="Digite sua senha"
                required
                name="password"
              />
            </div>

            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 transition-colors"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
