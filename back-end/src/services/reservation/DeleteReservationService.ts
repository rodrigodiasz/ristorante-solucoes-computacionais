import prismaClient from '../../prisma';

class DeleteReservationService {
  async execute(reservation_id: string) {
    // Verificar se a reserva existe
    const reservation = await prismaClient.reservation.findUnique({
      where: { id: reservation_id },
      select: { id: true, date: true, time: true },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // Deletar a reserva
    await prismaClient.reservation.delete({
      where: { id: reservation_id },
    });

    return {
      message: 'Reservation deleted successfully',
      deletedReservation: reservation,
    };
  }
}

export { DeleteReservationService };
