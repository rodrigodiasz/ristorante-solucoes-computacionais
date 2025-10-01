import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
    async handle(req: Request, res: Response) {
        try {
            const { name, price, description, category_id, banner } = req.body;
            
            // Validate required fields
            if (!name || !price || !description || !category_id) {
                return res.status(400).json({
                    error: "Missing required fields",
                    details: { name: !!name, price: !!price, description: !!description, category_id: !!category_id }
                });
            }
            
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
        } catch (error) {
            console.error("Error in CreateProductController:", error);
            return res.status(400).json({
                error: "Failed to create product",
                details: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}

export { CreateProductController };