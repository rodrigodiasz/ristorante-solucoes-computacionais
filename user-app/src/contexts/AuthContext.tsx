'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('usersapp_token');
      if (savedToken) {
        setToken(savedToken);
        // Verificar se o token ainda é válido fazendo uma requisição para /me
        fetchUserData(savedToken);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (authToken: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.USERSAPP.PROFILE, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token inválido, remover do localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('usersapp_token');
        }
        setToken(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);

      // Se for erro de rede, não remover o token (servidor pode estar offline)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error(
          'Servidor backend não está disponível. Verifique se está rodando na porta 3333.'
        );
      } else {
        // Outros erros, remover token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('usersapp_token');
        }
        setToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.USERSAPP.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('usersapp_token', data.token);
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer login');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.USERSAPP.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Após o cadastro, fazer login automaticamente
        await login(email, password);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar conta');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usersapp_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
