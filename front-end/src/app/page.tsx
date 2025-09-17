import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Ristorante - Sistema de Gerenciamento
        </h1>
        <p className="text-muted-foreground mb-8">
          Gerencie seu restaurante de forma eficiente
        </p>
        <Link href="/dashboard">
          <Button size="lg">Acessar Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
