import prismaClient from '../../prisma';

interface UpdateReservationRequest {
  reservation_id: string;
  date?: Date;
  time?: string;
  people_count?: number;
  status?: string;
  notes?: string;
}

class UpdateReservationService {
  async execute({
    reservation_id,
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
