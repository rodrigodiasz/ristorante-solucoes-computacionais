import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
    async handle(req: Request, res: Response) {
        const { name, price, description, category_id, banner } = req.body;
        let bannerUrl = banner || "";
        if (req.file) {
            bannerUrl = `/files/uploads/${req.file.filename}`;
        }

        const createProductService = new CreateProductService();

        const product = await createProductService.execute({
            name,
            price,
            description,
            banner: bannerUrl,
            category_id,
        });

        return res.json(product);
    }
}

export { CreateProductController };