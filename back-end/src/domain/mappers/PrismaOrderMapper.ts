import { Order } from "../entities/Order";
// @ts-ignore
import { Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(r: PrismaOrder): Order {
    return Order.create({
      id: r.id,
      table: r.table,
      status: r.status,
      draft: r.draft,
      name: r.name ?? null,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: Order) {
    return {
      id: entity.id,
      table: entity.table,
      status: entity.status,
      draft: entity.draft,
      name: entity.name ?? null,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
