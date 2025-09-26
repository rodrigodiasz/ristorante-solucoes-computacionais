import { Router } from "express";

// User Controllers
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";

// Category Controllers
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";

// Product Controllers
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListProductController } from "./controllers/product/ListProductController";

// Middlewares
import { isAuthenticated } from "./middlewares/isAuthenticated";

const router = Router();

// Health check route
router.get("/health", (req, res) => {
    res.json({
        message: "API is running",
        timestamp: new Date().toISOString(),
    });
});

// User routes
router.post("/users", new CreateUserController().handle);
router.post("/session", new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);

// Category routes
router.post(
    "/categories",
    isAuthenticated,
    new CreateCategoryController().handle
);
router.get("/categories", isAuthenticated, new ListCategoryController().handle);

// Product routes
router.post("/products", isAuthenticated, new CreateProductController().handle);
router.get("/products", isAuthenticated, new ListProductController().handle);

// API info route
router.get("/", (req, res) => {
    res.json({
        message: "Ristorante API",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            users: {
                create: "POST /api/users",
                login: "POST /api/session",
                profile: "GET /api/me",
            },
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