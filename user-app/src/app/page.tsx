'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm, RegisterForm } from '@/components/auth/AuthForms';
import {
  ReservationForm,
  ReservationData,
} from '@/components/reservation/ReservationForm';
import {
  ReservationsList,
  Reservation,
} from '@/components/reservation/ReservationsList';
import { useAuth } from '@/contexts/AuthContext';
import {
  Clock,
  Phone,
  MapPin,
  LogOut,
  Instagram,
  Facebook,
  Twitter,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/api';
import { ThemeSwitch } from '@/components/ui/switch';

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Carregar reservas do usuário quando logado
  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user]);

  // Carregar produtos e categorias ao montar o componente
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadReservations = async () => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('usersapp_token')
          : null;
      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      console.log('Token encontrado:', token.substring(0, 20) + '...');

      const response = await fetch(API_ENDPOINTS.RESERVATIONS.LIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        const error = await response.json();
        console.error('Erro ao carregar reservas:', error);
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    }
  };

  const handleReservationSubmit = async (data: ReservationData) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('usersapp_token')
        : null;
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(API_ENDPOINTS.RESERVATIONS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer reserva');
    }

    // Recarregar lista de reservas
    await loadReservations();
  };

  const handleDeleteReservation = async (id: string) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('usersapp_token')
        : null;
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(API_ENDPOINTS.RESERVATIONS.DELETE(id), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao cancelar reserva');
    }

    // Recarregar lista de reservas
    await loadReservations();
  };

  const handleLogout = () => {
    logout();
    setReservations([]);
    toast.success('Logout realizado com sucesso!');
  };

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS.LIST);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES.LIST);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        // Selecionar primeira categoria por padrão
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const filteredProducts = products.filter(
    (product: any) => product.category_id === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 text-primary-foreground rounded-lg p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 2 0 0 0 2-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v0" />
                  <path d="M21 15v7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  <span className="text-emerald-500">Ris</span>
                  <span className="text-emerald-500 dark:text-white">tora</span>
                  <span className="text-emerald-500 dark:text-red-500">
                    nte
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  Culinária Italiana
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#cardapio"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Cardápio
              </a>
              <a
                href="#contato"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Contato
              </a>
              {user && (
                <div className="flex items-center gap-2 text-foreground/80">
                  <span className="text-sm">Olá, {user.name}</span>
                </div>
              )}
            </nav>

            {/* Theme Switch and Mobile Menu */}
            <div className="flex items-center gap-4">
              <ThemeSwitch />
              <div className="md:hidden">
                <button className="text-foreground/80 hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Reserve Sua Mesa
            </h1>
            <p className="text-xl text-muted-foreground">
              Experimente momentos gastronômicos inesquecíveis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Panel - Auth or Reservation Form */}
            <div className="space-y-6">
              {user ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">
                        Olá, {user.name}!
                      </h2>
                      <p className="text-muted-foreground">
                        Faça sua reserva abaixo
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="flex bg-red-500 text-white hover:text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                  <ReservationForm onSubmit={handleReservationSubmit} />
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={!showRegister ? 'default' : 'outline'}
                      onClick={() => setShowRegister(false)}
                      className="flex-1"
                    >
                      Entrar
                    </Button>
                    <Button
                      variant={showRegister ? 'default' : 'outline'}
                      onClick={() => setShowRegister(true)}
                      className="flex-1"
                    >
                      Cadastrar
                    </Button>
                  </div>
                  {showRegister ? (
                    <RegisterForm onSuccess={() => setShowRegister(false)} />
                  ) : (
                    <LoginForm onSuccess={() => {}} />
                  )}
                </div>
              )}
            </div>

            {/* Right Panel - Reservations */}
            <div>
              {user ? (
                <ReservationsList
                  reservations={reservations}
                  onDeleteReservation={handleDeleteReservation}
                />
              ) : (
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Reservas</CardTitle>
                    <CardDescription>0 reservas no sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground">
                        Faça login para ver suas reservas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="cardapio" className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nosso Cardápio
            </h2>
            <p className="text-xl text-muted-foreground">
              Pratos cuidadosamente preparados com os melhores ingredientes.
            </p>
          </div>

          {/* Products Card with Tabs */}
          {isLoadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-lg">
                {/* Category Tabs */}
                <div className="border-b border-border">
                  <div className="flex overflow-x-auto">
                    {categories.map((category: any) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors
                          ${
                            selectedCategory === category.id
                              ? 'border-primary text-primary'
                              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                          }
                        `}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products List */}
                <CardContent className="p-6">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        Nenhum produto encontrado nesta categoria.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredProducts.map((product: any) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between py-4 px-4 border-b border-border/50 hover:bg-muted/50 transition-colors rounded"
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {product.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-6">
                            <p className="text-xl font-bold text-primary">
                              R${' '}
                              {parseFloat(product.price)
                                .toFixed(2)
                                .replace('.', ',')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground mt-8 pt-6 border-t border-border">
                    <p>
                      *Cardápio e preços sujeitos a alterações. Pergunte ao
                      garçom sobre nossos pratos especiais do dia.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-muted-foreground">
              Visite-nos e tenha uma experiência gastronômica inesquecível
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-lg border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975760885186!2d-46.63330908502165!3d-23.55025398468751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59a00cc9896b%3A0x4d7fa8becba4e40d!2sLiberdade%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001506-010!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Informações de Contato
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Estamos localizados no coração da cidade, prontos para
                    recebê-lo com o melhor da culinária italiana.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        Endereço
                      </h4>
                      <p className="text-muted-foreground">
                        Rua Gastronômica, 123
                        <br />
                        Centro - CEP 12345-678
                        <br />
                        São Paulo - SP
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        Telefone
                      </h4>
                      <p className="text-muted-foreground">
                        +55 (11) 1234-5678
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        Horário de Funcionamento
                      </h4>
                      <p className="text-muted-foreground">
                        Segunda a Sábado: 11:00 - 22:00
                        <br />
                        Domingo: 12:00 - 21:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 text-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Sobre Nós
              </h3>
              <p className="text-muted-foreground text-sm">
                Um restaurante dedicado a proporcionar experiências
                gastronômicas inesquecíveis com os melhores ingredientes e
                técnicas.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Contato
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Rua Gastronômica, 123</p>
                <p>Centro - CEP 12345-678</p>
                <p>+1 (555) 123-4567</p>
                <p>contato@ristorante.com</p>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Horário
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Segunda a Domingo</p>
                <p>11:00 - 22:00</p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Redes Sociais
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Ristorante. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
