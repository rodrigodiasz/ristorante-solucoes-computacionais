import { Request, Response } from 'express';
import { GetRestaurantSettingsService } from '../../services/restaurantSettings/GetRestaurantSettingsService';

class GetRestaurantSettingsController {
  async handle(req: Request, res: Response) {
    try {
      const getRestaurantSettingsService = new GetRestaurantSettingsService();
      const settings = await getRestaurantSettingsService.execute();

      return res.json(settings);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || 'Erro ao obter configurações do restaurante',
      });
    }
  }
}

export { GetRestaurantSettingsController };

