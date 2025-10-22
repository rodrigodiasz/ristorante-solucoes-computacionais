import axios from 'axios';

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'GARCOM' | 'COZINHA' | 'GERENTE';
  created_at: string;
}
