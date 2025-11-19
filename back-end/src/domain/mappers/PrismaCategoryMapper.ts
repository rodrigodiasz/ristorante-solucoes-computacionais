import { Category } from "../entities/Category";
// @ts-ignore
import { Category as PrismaCategory } from "@prisma/client";

export class PrismaCategoryMapper {
  static toDomain(r: PrismaCategory): Category {
    return Category.create({
      id: r.id,
      name: r.name,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: Category) {
    return {
      id: entity.id,
      name: entity.name,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
