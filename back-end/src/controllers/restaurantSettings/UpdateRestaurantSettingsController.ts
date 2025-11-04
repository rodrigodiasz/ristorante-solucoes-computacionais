import { Request, Response } from 'express';
import { UpdateRestaurantSettingsService } from '../../services/restaurantSettings/UpdateRestaurantSettingsService';

class UpdateRestaurantSettingsController {
  async handle(req: Request, res: Response) {
    const { max_tables } = req.body;

    if (!max_tables) {
      return res.status(400).json({
        error: 'O campo max_tables é obrigatório',
      });
    }

    // Converte para número se vier como string
    const maxTablesNumber = typeof max_tables === 'string' 
      ? parseInt(max_tables, 10) 
      : Number(max_tables);

    if (isNaN(maxTablesNumber)) {
      return res.status(400).json({
        error: 'O campo max_tables deve ser um número válido',
      });
    }

    try {
      const updateRestaurantSettingsService = new UpdateRestaurantSettingsService();
      const settings = await updateRestaurantSettingsService.execute({
        max_tables: maxTablesNumber,
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

