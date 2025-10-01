import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
    async handle(req: Request, res: Response) {
        try {
            console.log("=== CreateProductController (Production Debug) ===");
            console.log("Environment:", process.env.NODE_ENV);
            console.log("Request body:", req.body);
            console.log("Request file:", req.file);
            console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
            console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
            
            const { name, price, description, category_id, banner } = req.body;
            
            // Validate required fields
            if (!name || !price || !description || !category_id) {
                console.log("Missing required fields:", { name: !!name, price: !!price, description: !!description, category_id: !!category_id });
                return res.status(400).json({
                    error: "Missing required fields",
                    details: { name: !!name, price: !!price, description: !!description, category_id: !!category_id }
                });
            }
            
            let bannerUrl = banner || "";
            if (req.file) {
                bannerUrl = `/files/uploads/${req.file.filename}`;
                console.log("File uploaded successfully:", req.file.filename);
            }

            console.log("Creating product with banner URL:", bannerUrl);

            const createProductService = new CreateProductService();

            const product = await createProductService.execute({
                name,
                price,
                description,
                banner: bannerUrl,
                category_id,
            });

            console.log("Product created successfully:", product.id);
            return res.json(product);
        } catch (error) {
            console.error("Error in CreateProductController:", error);
            console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
            return res.status(400).json({
                error: "Failed to create product",
                details: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}

export { CreateProductController };