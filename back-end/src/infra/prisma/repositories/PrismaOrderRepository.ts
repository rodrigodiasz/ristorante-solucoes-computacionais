import prismaClient from "../../../prisma";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order } from "../../../domain/entities/Order";
import { PrismaOrderMapper } from "../../../domain/mappers/PrismaOrderMapper";

export class PrismaOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const data = PrismaOrderMapper.toPrisma(order);
    const created = await prismaClient.order.create({
      data: {
        table: data.table as number,
        status: data.status as boolean,
        draft: data.draft as boolean,
        name: (data as any).name ?? undefined,
      } as any,
    });
    return PrismaOrderMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<Order | null> {
    const found = await prismaClient.order.findUnique({ where: { id } });
    return found ? PrismaOrderMapper.toDomain(found as any) : null;
  }

  async listOpen(): Promise<Order[]> {
    const rows = await prismaClient.order.findMany({ where: { draft: false, status: false }, orderBy: { created_at: "desc" } as any });
    return rows.map((r: any) => PrismaOrderMapper.toDomain(r));
  }

  async update(order: Order): Promise<Order> {
    const data = PrismaOrderMapper.toPrisma(order);
    const updated = await prismaClient.order.update({
      where: { id: data.id as string },
      data: {
        table: data.table as number,
        status: data.status as boolean,
        draft: data.draft as boolean,
        name: (data as any).name ?? undefined,
      } as any,
    });
    return PrismaOrderMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.order.delete({ where: { id } });
  }
}
