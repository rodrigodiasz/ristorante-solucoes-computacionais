import { Request, Response } from 'express';
import { UpdateCategoryService } from '../../services/category/UpdateCategoryService';

class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const updateCategoryService = new UpdateCategoryService();
      const category = await updateCategoryService.execute({ id, name });

      return res.json(category);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { UpdateCategoryController };
