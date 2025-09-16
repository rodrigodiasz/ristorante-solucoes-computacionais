import { Router } from "express";

// Category Controllers
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";

// Product Controllers
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListProductController } from "./controllers/product/ListProductController";

const router = Router();

// Health check route
router.get("/health", (req, res) => {
    res.json({
        message: "API is running",
        timestamp: new Date().toISOString(),
    });
});

// Category routes
router.post("/categories", new CreateCategoryController().handle);
router.get("/categories", new ListCategoryController().handle);

// Product routes
router.post("/products", new CreateProductController().handle);
router.get("/products", new ListProductController().handle);

// API info route
router.get("/", (req, res) => {
    res.json({
        message: "Ristorante API",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            categories: {
                create: "POST /api/categories",
                list: "GET /api/categories",
            },
            products: {
                create: "POST /api/products",
                list: "GET /api/products",
            },
        },
    });
});

export { router };