'use client';

import { useState, useEffect } from 'react';
import { getCookieClient } from '@/lib/cookieClient';
import { api } from '@/services/api';

export function useUserRole() {
  const [userRole, setUserRole] = useState<
    'ADMIN' | 'USER' | 'GARCOM' | 'COZINHA' | 'GERENTE' | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const token = await getCookieClient();
        if (!token) {
          setUserRole(null);
          setLoading(false);
          return;
        }

        const response = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  return {
    userRole,
    loading,
    isAdmin: userRole === 'ADMIN',
    isManager: userRole === 'GERENTE',
    isWaiter: userRole === 'GARCOM',
    isKitchen: userRole === 'COZINHA',
  };
}
