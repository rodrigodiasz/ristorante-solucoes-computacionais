import { Request, Response } from 'express';
import { UpdateRestaurantSettingsService } from '../../services/restaurantSettings/UpdateRestaurantSettingsService';

class UpdateRestaurantSettingsController {
  async handle(req: Request, res: Response) {
    const { max_tables } = req.body;

    if (!max_tables || typeof max_tables !== 'number') {
      return res.status(400).json({
        error: 'O campo max_tables é obrigatório e deve ser um número',
      });
    }

    try {
      const updateRestaurantSettingsService = new UpdateRestaurantSettingsService();
      const settings = await updateRestaurantSettingsService.execute({
        max_tables: parseInt(max_tables),
      });

      return res.json(settings);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || 'Erro ao atualizar configurações do restaurante',
      });
    }
  }
}

export { UpdateRestaurantSettingsController };

