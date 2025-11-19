import prismaClient from "../../../prisma";
import { IReservationRepository } from "../../../domain/repositories/IReservationRepository";
import { Reservation } from "../../../domain/entities/Reservation";
import { PrismaReservationMapper } from "../../../domain/mappers/PrismaReservationMapper";

export class PrismaReservationRepository implements IReservationRepository {
  async create(reservation: Reservation): Promise<Reservation> {
    const data = PrismaReservationMapper.toPrisma(reservation);
    const created = await prismaClient.reservation.create({ data });
    return PrismaReservationMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<Reservation | null> {
    const found = await prismaClient.reservation.findUnique({ where: { id } });
    return found ? PrismaReservationMapper.toDomain(found as any) : null;
  }

  async listByUser(userAppId: string): Promise<Reservation[]> {
    const rows = await prismaClient.reservation.findMany({ where: { user_app_id: userAppId } });
    return rows.map((r: any) => PrismaReservationMapper.toDomain(r));
  }

  async update(reservation: Reservation): Promise<Reservation> {
    const data = PrismaReservationMapper.toPrisma(reservation);
    const updated = await prismaClient.reservation.update({ where: { id: data.id as string }, data });
    return PrismaReservationMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.reservation.delete({ where: { id } });
  }
}
