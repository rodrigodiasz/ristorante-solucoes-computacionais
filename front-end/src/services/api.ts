import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
}
