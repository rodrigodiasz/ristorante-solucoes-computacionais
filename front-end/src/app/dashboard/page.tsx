import { BarChart3 } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6 mx-auto w-fit">
            <BarChart3 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">
            Bem-vindo ao sistema de gerenciamento do restaurante
          </p>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 max-w-md">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Aqui você terá uma visão geral dos pedidos, mesas ativas e
              estatísticas do restaurante.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
