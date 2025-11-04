import prismaClient from '../../prisma';

interface UpdateRestaurantSettingsRequest {
  max_tables: number;
}

class UpdateRestaurantSettingsService {
  async execute({ max_tables }: UpdateRestaurantSettingsRequest) {
    if (max_tables < 1) {
      throw new Error('O número máximo de mesas deve ser pelo menos 1');
    }

    // Verifica se já existe configuração
    let settings = await prismaClient.restaurantSettings.findUnique({
      where: { id: 'restaurant_settings' },
    });

    if (settings) {
      // Atualiza se existir
      settings = await prismaClient.restaurantSettings.update({
        where: { id: 'restaurant_settings' },
        data: {
          max_tables,
        },
      });
    } else {
      // Cria se não existir
      settings = await prismaClient.restaurantSettings.create({
        data: {
          id: 'restaurant_settings',
          max_tables,
        },
      });
    }

    return settings;
  }
}

export { UpdateRestaurantSettingsService };

