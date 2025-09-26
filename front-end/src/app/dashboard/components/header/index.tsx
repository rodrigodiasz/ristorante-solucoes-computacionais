"use client";

import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeSwitch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    deleteCookie("session", { path: "/" });
    toast.success("Logout feito com sucesso!");
    router.replace("/");
  }

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="hover:opacity-80 transition-opacity"
          >
            <h1 className="text-3xl font-bold">
              <span className="text-emerald-500">Ris</span>
              <span className="text-emerald-500 dark:text-white">tora</span>
              <span className="text-emerald-500 dark:text-red-500">nte</span>
            </h1>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard/category"
              className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                isActive("/dashboard/category")
                  ? "text-emerald-500"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Categorias
            </Link>
            <Link
              href="/dashboard/product"
              className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                isActive("/dashboard/product")
                  ? "text-emerald-500"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Cardápio
            </Link>

            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <ThemeSwitch />
              <button
                className="p-2 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-full transition-colors"
                title="Sair"
                onClick={handleLogout}
              >
                <LogOutIcon size={20} className="text-red-500" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
