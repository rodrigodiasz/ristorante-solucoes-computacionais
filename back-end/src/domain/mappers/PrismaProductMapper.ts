import { Product } from "../entities/Product";
// @ts-ignore
import { Product as PrismaProduct } from "@prisma/client";

export class PrismaProductMapper {
  static toDomain(r: PrismaProduct): Product {
    return Product.create({
      id: r.id,
      name: r.name,
      price: r.price,
      description: r.description,
      banner: r.banner,
      categoryId: r.category_id,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: Product) {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      banner: entity.banner,
      category_id: entity.categoryId,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
