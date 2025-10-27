import prismaClient from '../../prisma';

class DetailReservationService {
  async execute(reservation_id: string) {
    const reservation = await prismaClient.reservation.findUnique({
      where: {
        id: reservation_id,
      },
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

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return reservation;
  }
}

export { DetailReservationService };
