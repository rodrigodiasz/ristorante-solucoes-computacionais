import { Request, Response } from 'express';
import { UpdateProductService } from '../../services/product/UpdateProductService';

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { name, price, description, banner, category_id } = req.body;

    try {
      const updateProductService = new UpdateProductService();
      const product = await updateProductService.execute({
        id,
        name,
        price,
        description,
        banner,
        category_id,
      });

      return res.json(product);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { UpdateProductController };
