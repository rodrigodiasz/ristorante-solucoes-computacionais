import { Request, Response } from 'express';
import { DeleteCategoryService } from '../../services/category/DeleteCategoryService';

class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleteCategoryService = new DeleteCategoryService();
      const result = await deleteCategoryService.execute(id);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { DeleteCategoryController };
