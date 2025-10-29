'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Users, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReservationFormProps {
  onReservationCreated: () => void;
  onClose: () => void;
}

export function ReservationForm({
  onReservationCreated,
  onClose,
}: ReservationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    people_count: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.people_count) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const peopleCount = parseInt(formData.people_count);
    if (peopleCount < 1 || peopleCount > 20) {
      toast.error('Número de pessoas deve estar entre 1 e 20');
      return;
    }

    setIsLoading(true);

    try {
      const token = await getCookieClient();
      await api.post(
        '/reservationsdashboard',
        {
          date: formData.date,
          time: formData.time,
          people_count: peopleCount,
          status: 'PENDING',
          notes: formData.notes || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Reserva criada com sucesso!');
      onReservationCreated();
      onClose();

      // Reset form
      setFormData({
        date: '',
        time: '',
        people_count: '',
        notes: '',
      });
    } catch (error: any) {
      console.error('Erro ao criar reserva:', error);
      const errorMessage =
        error.response?.data?.error || 'Erro ao criar reserva';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nova Reserva
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data da Reserva *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={formData.date}
                onChange={e => handleInputChange('date', e.target.value)}
                min={today}
                className="pl-10 w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Horário *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="time"
                value={formData.time}
                onChange={e => handleInputChange('time', e.target.value)}
                className="pl-10 w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Número de Pessoas *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="number"
                value={formData.people_count}
                onChange={e =>
                  handleInputChange('people_count', e.target.value)
                }
                min="1"
                max="20"
                placeholder="Ex: 4"
                className="pl-10 w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Observações
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Textarea
                value={formData.notes}
                onChange={e => handleInputChange('notes', e.target.value)}
                placeholder="Observações especiais, alergias, etc."
                rows={3}
                className="pl-10 w-full dark:bg-gray-700 bg-white text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Reserva'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
