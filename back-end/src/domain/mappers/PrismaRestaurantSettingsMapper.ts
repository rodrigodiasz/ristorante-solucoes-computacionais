import { RestaurantSettings } from "../entities/RestaurantSettings";
// @ts-ignore
import { RestaurantSettings as PrismaRestaurantSettings } from "@prisma/client";

export class PrismaRestaurantSettingsMapper {
  static toDomain(r: PrismaRestaurantSettings): RestaurantSettings {
    return RestaurantSettings.create({
      id: r.id,
      maxTables: r.max_tables,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: RestaurantSettings) {
    return {
      id: entity.id,
      max_tables: entity.maxTables,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
