import prismaClient from '../../prisma';

class GetRestaurantSettingsService {
  async execute() {
    // Tenta buscar as configurações
    let settings = await prismaClient.restaurantSettings.findUnique({
      where: { id: 'restaurant_settings' },
    });

    // Se não existir, cria com valor padrão
    if (!settings) {
      settings = await prismaClient.restaurantSettings.create({
        data: {
          id: 'restaurant_settings',
          max_tables: 5,
        },
      });
    }

    return settings;
  }
}

export { GetRestaurantSettingsService };

