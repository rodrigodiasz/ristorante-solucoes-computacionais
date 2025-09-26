"use client";
import Link from "next/link";
import { api } from "../../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (name === "" || email === "" || password === "") {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/users", {
        name,
        email,
        password,
      });
      toast.success("Conta criada com sucesso!");
      router.push("/");
    } catch (err: any) {
      console.log(err);
      const errorMessage = err.response?.data?.error || "Erro ao criar conta";
      toast.error(errorMessage);
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
              Criar Conta
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os dados para criar sua conta
            </p>
          </div>
        </div>

        <div className="mt-8">
          <form
            className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700"
            onSubmit={handleRegister}
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Nome
              </label>
              <Input
                id="name"
                className="w-full dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
                type="text"
                placeholder="Digite seu nome completo"
                required
                name="name"
              />
            </div>

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
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Já possui uma conta?{" "}
            <Link
              href="/"
              className="font-medium text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
