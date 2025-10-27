import prismaClient from '../../prisma';

class ListReservationsService {
  async execute(user_id?: string, filterByUser: boolean = true) {
    const reservations = await prismaClient.reservation.findMany({
      where: filterByUser && user_id ? { user_app_id: user_id } : undefined,
      include: {
        user_app: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return reservations;
  }
}

export { ListReservationsService };
