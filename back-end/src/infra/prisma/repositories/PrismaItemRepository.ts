import prismaClient from "../../../prisma";
import { IItemRepository } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";
import { PrismaItemMapper } from "../../../domain/mappers/PrismaItemMapper";

export class PrismaItemRepository implements IItemRepository {
  async create(item: Item): Promise<Item> {
    const data = PrismaItemMapper.toPrisma(item);
    const created = await prismaClient.item.create({
      data: {
        amount: data.amount as number,
        order_id: data.order_id as string,
        product_id: data.product_id as string,
      } as any,
    });
    return PrismaItemMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<Item | null> {
    const found = await prismaClient.item.findUnique({ where: { id } });
    return found ? PrismaItemMapper.toDomain(found as any) : null;
  }

  async listByOrder(orderId: string): Promise<Item[]> {
    const rows = await prismaClient.item.findMany({ where: { order_id: orderId } });
    return rows.map((r: any) => PrismaItemMapper.toDomain(r));
  }

  async update(item: Item): Promise<Item> {
    const data = PrismaItemMapper.toPrisma(item);
    const updated = await prismaClient.item.update({
      where: { id: data.id as string },
      data: {
        amount: data.amount as number,
        order_id: data.order_id as string,
        product_id: data.product_id as string,
      } as any,
    });
    return PrismaItemMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.item.delete({ where: { id } });
  }
}
