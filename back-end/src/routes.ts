import { Router } from 'express';

// User Controllers
import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { ListUsersController } from './controllers/user/ListUsersController';
import { UpdateUserRoleController } from './controllers/user/UpdateUserRoleController';
import { DeleteUserController } from './controllers/user/DeleteUserController';
import { UpdateUserController } from './controllers/user/UpdateUserController';

// Permission Controllers
import { ListPermissionsController } from './controllers/permission/ListPermissionsController';
import { UpdatePermissionController } from './controllers/permission/UpdatePermissionController';
import { CheckPermissionController } from './controllers/permission/CheckPermissionController';
import { GetFirstAllowedRouteController } from './controllers/permission/GetFirstAllowedRouteController';

// Category Controllers
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { ListCategoryController } from './controllers/category/ListCategoryController';
import { UpdateCategoryController } from './controllers/category/UpdateCategoryController';
import { DeleteCategoryController } from './controllers/category/DeleteCategoryController';

// Product Controllers
import { CreateProductController } from './controllers/product/CreateProductController';
import { ListProductController } from './controllers/product/ListProductController';
import { ListByCategoryController } from './controllers/product/ListByCategoryController';
import { UpdateProductController } from './controllers/product/UpdateProductController';
import { DeleteProductController } from './controllers/product/DeleteProductController';

// Order Controllers
import { CreateOrderController } from './controllers/order/CreateOrderController';
import { RemoveOrderController } from './controllers/order/RemoveOrderController';
import { AddItemController } from './controllers/order/AddItemController';
import { RemoveItemController } from './controllers/order/RemoveItemController';
import { SendOrderController } from './controllers/order/SendOrderController';
import { ListOrdersController } from './controllers/order/ListOrdersController';
import { DetailOrderController } from './controllers/order/DetailOrderController';
import { FinishOrderController } from './controllers/order/FinishOrderController';

// Middlewares
import { isAuthenticated } from './middlewares/isAuthenticated';
import { isAdmin } from './middlewares/isAdmin';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// User routes
router.post('/users', new CreateUserController().handle);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);

// Admin routes
router.get(
  '/admin/users',
  isAuthenticated,
  isAdmin,
  new ListUsersController().handle
);
router.put(
  '/admin/users/role',
  isAuthenticated,
  isAdmin,
  new UpdateUserRoleController().handle
);
router.put(
  '/admin/users/:user_id',
  isAuthenticated,
  isAdmin,
  new UpdateUserController().handle
);
router.delete(
  '/admin/users/:user_id',
  isAuthenticated,
  isAdmin,
  new DeleteUserController().handle
);

// Permission routes
router.get(
  '/admin/permissions',
  isAuthenticated,
  isAdmin,
  new ListPermissionsController().handle
);
router.put(
  '/admin/permissions',
  isAuthenticated,
  isAdmin,
  new UpdatePermissionController().handle
);

// Public permission check route (for middleware)
router.get('/permissions/check', new CheckPermissionController().handle);

// Public route to get first allowed route for a role
router.get(
  '/permissions/first-route',
  new GetFirstAllowedRouteController().handle
);

// Category routes
router.post(
  '/categories',
  isAuthenticated,
  new CreateCategoryController().handle
);
router.get('/categories', isAuthenticated, new ListCategoryController().handle);
router.put(
  '/categories/:id',
  isAuthenticated,
  new UpdateCategoryController().handle
);
router.delete(
  '/categories/:id',
  isAuthenticated,
  new DeleteCategoryController().handle
);

// Product routes
router.post('/products', isAuthenticated, new CreateProductController().handle);
router.get('/products', isAuthenticated, new ListProductController().handle);
router.put(
  '/products/:id',
  isAuthenticated,
  new UpdateProductController().handle
);
router.delete(
  '/products/:id',
  isAuthenticated,
  new DeleteProductController().handle
);
router.get(
  '/category/product',
  isAuthenticated,
  new ListByCategoryController().handle
);

// Order routes
router.post('/order', isAuthenticated, new CreateOrderController().handle);
router.delete('/order', isAuthenticated, new RemoveOrderController().handle);
router.post('/order/add', isAuthenticated, new AddItemController().handle);
router.delete(
  '/order/remove',
  isAuthenticated,
  new RemoveItemController().handle
);
router.put('/order/send', isAuthenticated, new SendOrderController().handle);
router.get('/orders', isAuthenticated, new ListOrdersController().handle);
router.get(
  '/order/detail',
  isAuthenticated,
  new DetailOrderController().handle
);
router.put(
  '/order/finish',
  isAuthenticated,
  new FinishOrderController().handle
);

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Ristorante API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: {
        create: 'POST /api/users',
        login: 'POST /api/session',
        profile: 'GET /api/me',
      },
      admin: {
        listUsers: 'GET /api/admin/users',
        updateUserRole: 'PUT /api/admin/users/role',
        listPermissions: 'GET /api/admin/permissions',
        updatePermission: 'PUT /api/admin/permissions',
      },
      permissions: {
        check: 'GET /api/permissions/check?role=ROLE&route=ROUTE',
        firstRoute: 'GET /api/permissions/first-route?role=ROLE',
      },
      categories: {
        create: 'POST /api/categories',
        list: 'GET /api/categories',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id',
      },
      products: {
        create: 'POST /api/products',
        list: 'GET /api/products',
        update: 'PUT /api/products/:id',
        delete: 'DELETE /api/products/:id',
      },
      orders: {
        create: 'POST /api/order',
        remove: 'DELETE /api/order',
        addItem: 'POST /api/order/add',
        removeItem: 'DELETE /api/order/remove',
        send: 'PUT /api/order/send',
        list: 'GET /api/orders',
        detail: 'GET /api/order/detail',
        finish: 'PUT /api/order/finish',
      },
    },
  });
});

export { router };
