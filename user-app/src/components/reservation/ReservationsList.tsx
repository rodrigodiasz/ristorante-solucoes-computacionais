'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface Reservation {
  id: string;
  date: string;
  time: string;
  people_count: number;
  status: string;
  notes?: string;
  created_at: string;
}

interface ReservationsListProps {
  reservations: Reservation[];
  onDeleteReservation: (id: string) => Promise<void>;
}

export function ReservationsList({
  reservations,
  onDeleteReservation,
}: ReservationsListProps) {
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await onDeleteReservation(id);
        toast.success('Reserva cancelada com sucesso!');
      } catch (error) {
        toast.error('Erro ao cancelar reserva');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (reservations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
          <CardDescription>0 reservas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Nenhuma reserva ainda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reservas</CardTitle>
        <CardDescription>
          {reservations.length} reservas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500 dark:text-white" />
                  <span className="font-medium">
                    {reservation.people_count}{' '}
                    {reservation.people_count === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                </div>
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusText(reservation.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(reservation.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {reservation.people_count}{' '}
                    {reservation.people_count === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                </div>
              </div>

              {reservation.notes && (
                <div className="text-sm text-gray-600 dark:text-white">
                  <strong>Observações:</strong> {reservation.notes}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(reservation.id)}
                  disabled={reservation.status === 'CANCELLED'}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
