'use client';

import { useState } from 'react';
import { ReservationProps } from '@/lib/order.type';
import { ReservationsTable } from './ReservationsTable';
import { ReservationForm } from './ReservationForm';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Calendar, RefreshCw, Plus } from 'lucide-react';

interface ReservationsClientProps {
  initialReservations: ReservationProps[];
}

export function ReservationsClient({
  initialReservations,
}: ReservationsClientProps) {
  const [reservations, setReservations] =
    useState<ReservationProps[]>(initialReservations);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const refreshReservations = async () => {
    setIsLoading(true);
    try {
      const token = await getCookieClient();
      const response = await api.get('/reservationsdashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(response.data);
      toast.success('Reservas atualizadas!');
    } catch (error) {
      console.error('Erro ao atualizar reservas:', error);
      toast.error('Erro ao atualizar reservas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reservas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie as reservas de mesas do restaurante
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Nova Reserva
          </button>
          <button
            onClick={refreshReservations}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Lista de Reservas
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Total de reservas: {reservations.length}
          </p>
        </div>
        <ReservationsTable
          reservations={reservations}
          onReservationUpdated={refreshReservations}
        />
      </div>

      {isFormOpen && (
        <ReservationForm
          onReservationCreated={refreshReservations}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
