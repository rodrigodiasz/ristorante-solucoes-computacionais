import prismaClient from "../../prisma";

interface CreateReservationRequest {
  user_app_id: string;
  date: Date;
  time: string;
  people_count: number;
  status?: string;
  notes?: string;
}

class CreateReservationService {
  async execute({
    user_app_id,
    date,
    time,
    people_count,
    status = "PENDING",
    notes,
  }: CreateReservationRequest) {
    console.log("Creating reservation with data:", {
      user_app_id,
      date,
      time,
      people_count,
      status,
      notes,
    });

    // Verificar se o usuário existe
    const user = await prismaClient.usersApp.findUnique({
      where: { id: user_app_id },
    });

    if (!user) {
      console.error("User not found:", user_app_id);
      throw new Error("User not found");
    }

    console.log("User found:", user.email);

    const reservation = await prismaClient.reservation.create({
      data: {
        user_app_id,
        date,
        time,
        people_count,
        status,
        notes,
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

    console.log("Reservation created successfully:", reservation.id);

    return reservation;
  }
}

export { CreateReservationService };
