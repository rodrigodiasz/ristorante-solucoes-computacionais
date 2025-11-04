'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

interface ReservationFormProps {
  onSubmit: (data: ReservationData) => Promise<void>;
}

export interface ReservationData {
  date: string;
  time: string;
  people_count: number;
  notes?: string;
}

export function ReservationForm({ onSubmit }: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationData>({
    date: '',
    time: '',
    people_count: 2,
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      toast.success('Reserva realizada com sucesso!');
      // Reset form
      setFormData({
        date: '',
        time: '',
        people_count: 2,
        notes: '',
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao fazer reserva'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

  const peopleOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Faça Sua Reserva</CardTitle>
        <CardDescription>
          Preencha os detalhes abaixo para garantir sua reserva
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="people_count" className="text-sm font-medium">
                Número de Pessoas
              </label>
              <Select
                id="people_count"
                value={formData.people_count}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    people_count: parseInt(e.target.value),
                  }))
                }
                required
              >
                {peopleOptions.map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'pessoa' : 'pessoas'}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Data
              </label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e =>
                  setFormData(prev => ({ ...prev, date: e.target.value }))
                }
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Horário
              </label>
              <Select
                id="time"
                value={formData.time}
                onChange={e =>
                  setFormData(prev => ({ ...prev, time: e.target.value }))
                }
                required
              >
                <option value="">Selecione o horário</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Observações (opcional)
            </label>
            <Input
              id="notes"
              type="text"
              placeholder="Alguma observação especial?"
              value={formData.notes}
              onChange={e =>
                setFormData(prev => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Reservando...' : 'Reservar Mesa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
