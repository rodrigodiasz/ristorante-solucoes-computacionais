import { Reservation } from "../entities/Reservation";
// @ts-ignore
import { Reservation as PrismaReservation } from "@prisma/client";

export class PrismaReservationMapper {
  static toDomain(r: PrismaReservation): Reservation {
    return Reservation.create({
      id: r.id,
      userAppId: r.user_app_id,
      date: new Date(r.date),
      time: r.time,
      peopleCount: r.people_count,
      status: r.status,
      notes: r.notes ?? undefined,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: Reservation) {
    return {
      id: entity.id,
      user_app_id: entity.userAppId,
      date: entity.date,
      time: entity.time,
      people_count: entity.peopleCount,
      status: entity.status,
      notes: entity.notes ?? null,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
