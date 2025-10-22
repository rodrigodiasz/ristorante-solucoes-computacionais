import { Request, Response } from 'express';
import { DeleteProductService } from '../../services/product/DeleteProductService';

class DeleteProductController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleteProductService = new DeleteProductService();
      const result = await deleteProductService.execute(id);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { DeleteProductController };
