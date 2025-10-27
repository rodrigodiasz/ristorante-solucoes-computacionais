import prismaClient from '../../prisma';

interface UpdateReservationRequest {
  reservation_id: string;
  table_number?: number;
  date?: Date;
  time?: string;
  people_count?: number;
  status?: string;
  notes?: string;
}

class UpdateReservationService {
  async execute({
    reservation_id,
    table_number,
    date,
    time,
    people_count,
    status,
    notes,
  }: UpdateReservationRequest) {
    // Verificar se a reserva existe
    const reservation = await prismaClient.reservation.findUnique({
      where: { id: reservation_id },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const updateData: any = {};

    if (table_number !== undefined) {
      updateData.table_number = table_number;
    }

    if (date) {
      updateData.date = date;
    }

    if (time) {
      updateData.time = time;
    }

    if (people_count !== undefined) {
      updateData.people_count = people_count;
    }

    if (status) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    updateData.updated_at = new Date();

    const updatedReservation = await prismaClient.reservation.update({
      where: { id: reservation_id },
      data: updateData,
      include: {
        user_app: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedReservation;
  }
}

export { UpdateReservationService };
