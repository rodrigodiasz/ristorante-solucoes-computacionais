import { Item } from "../entities/Item";
// @ts-ignore
import { Item as PrismaItem } from "@prisma/client";

export class PrismaItemMapper {
  static toDomain(r: PrismaItem): Item {
    return Item.create({
      id: r.id,
      amount: r.amount,
      orderId: r.order_id,
      productId: r.product_id,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: Item) {
    return {
      id: entity.id,
      amount: entity.amount,
      order_id: entity.orderId,
      product_id: entity.productId,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
