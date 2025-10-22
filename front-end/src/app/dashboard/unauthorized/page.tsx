'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldXIcon, ArrowLeftIcon } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {/* Ícone */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <ShieldXIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Você não tem permissão para acessar esta página. Entre em contato
            com o administrador se acredita que isso é um erro.
          </p>

          {/* Botões de ação */}
          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>

            <Button onClick={handleGoBack} variant="outline" className="w-full">
              Página Anterior
            </Button>
          </div>

          {/* Informações adicionais */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Se você acredita que deveria ter acesso a esta página, entre em
              contato com o administrador do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
