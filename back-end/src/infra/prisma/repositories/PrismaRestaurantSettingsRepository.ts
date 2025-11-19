import prismaClient from "../../../prisma";
import { IRestaurantSettingsRepository } from "../../../domain/repositories/IRestaurantSettingsRepository";
import { RestaurantSettings } from "../../../domain/entities/RestaurantSettings";
import { PrismaRestaurantSettingsMapper } from "../../../domain/mappers/PrismaRestaurantSettingsMapper";

export class PrismaRestaurantSettingsRepository implements IRestaurantSettingsRepository {
  async get(): Promise<RestaurantSettings> {
    const row = await prismaClient.restaurantSettings.findUnique({ where: { id: "restaurant_settings" } });
    if (!row) {
      // ensure default exists
      const created = await prismaClient.restaurantSettings.create({ data: { id: "restaurant_settings", max_tables: 5 } as any });
      return PrismaRestaurantSettingsMapper.toDomain(created as any);
    }
    return PrismaRestaurantSettingsMapper.toDomain(row as any);
  }

  async update(settings: RestaurantSettings): Promise<RestaurantSettings> {
    const data = PrismaRestaurantSettingsMapper.toPrisma(settings);
    const updated = await prismaClient.restaurantSettings.update({
      where: { id: data.id as string },
      data: { max_tables: data.max_tables as number } as any,
    });
    return PrismaRestaurantSettingsMapper.toDomain(updated as any);
  }
}
