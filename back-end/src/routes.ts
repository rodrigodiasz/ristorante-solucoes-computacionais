import { Router } from 'express';

// User Controllers
import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { ListUsersController } from './controllers/user/ListUsersController';
import { UpdateUserRoleController } from './controllers/user/UpdateUserRoleController';
import { DeleteUserController } from './controllers/user/DeleteUserController';
import { UpdateUserController } from './controllers/user/UpdateUserController';

// UsersApp Controllers
import { CreateUsersAppController } from './controllers/usersapp/CreateUsersAppController';
import { AuthUsersAppController } from './controllers/usersapp/AuthUsersAppController';
import { DetailUsersAppController } from './controllers/usersapp/DetailUsersAppController';
import { ListUsersAppController } from './controllers/usersapp/ListUsersAppController';
import { DeleteUsersAppController } from './controllers/usersapp/DeleteUsersAppController';
import { UpdateUsersAppController } from './controllers/usersapp/UpdateUsersAppController';

// Permission Controllers
import { ListPermissionsController } from './controllers/permission/ListPermissionsController';
import { UpdatePermissionController } from './controllers/permission/UpdatePermissionController';
import { CheckPermissionController } from './controllers/permission/CheckPermissionController';
import { GetFirstAllowedRouteController } from './controllers/permission/GetFirstAllowedRouteController';

// Restaurant Settings Controllers
import { GetRestaurantSettingsController } from './controllers/restaurantSettings/GetRestaurantSettingsController';
import { UpdateRestaurantSettingsController } from './controllers/restaurantSettings/UpdateRestaurantSettingsController';

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
import { ListOpenTablesController } from './controllers/order/ListOpenTablesController';
import { FinishOrderController } from './controllers/order/FinishOrderController';

// Reservation Controllers
import { CreateReservationController } from './controllers/reservation/CreateReservationController';
import { ListReservationsController } from './controllers/reservation/ListReservationsController';
import { DetailReservationController } from './controllers/reservation/DetailReservationController';
import { UpdateReservationController } from './controllers/reservation/UpdateReservationController';
import { DeleteReservationController } from './controllers/reservation/DeleteReservationController';

// Middlewares
import { isAuthenticated } from './middlewares/isAuthenticated';
import { isAdmin } from './middlewares/isAdmin';
import { upload } from './middlewares/upload';

// Middleware para autenticação de app (caso necessário)
import { isAuthenticatedApp } from './middlewares/isAuthenticatedApp';

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

// UsersApp routes
router.post('/usersapp', new CreateUsersAppController().handle);
router.post('/usersapp/session', new AuthUsersAppController().handle);
router.get(
  '/usersapp/me',
  isAuthenticatedApp,
  new DetailUsersAppController().handle
);

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

// Admin UsersApp routes
router.get(
  '/admin/usersapp',
  isAuthenticated,
  isAdmin,
  new ListUsersAppController().handle
);
router.put(
  '/admin/usersapp/:user_id',
  isAuthenticated,
  isAdmin,
  new UpdateUsersAppController().handle
);
router.delete(
  '/admin/usersapp/:user_id',
  isAuthenticated,
  isAdmin,
  new DeleteUsersAppController().handle
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

// Restaurant Settings routes
router.get(
  '/settings',
  isAuthenticated,
  new GetRestaurantSettingsController().handle
);
router.put(
  '/admin/settings',
  isAuthenticated,
  isAdmin,
  new UpdateRestaurantSettingsController().handle
);

// Public endpoints for user-app
router.get('/products', new ListProductController().handle);
router.get('/categories', new ListCategoryController().handle);
router.get('/category/product', new ListByCategoryController().handle);

// Category routes (protected endpoints for admin)
router.post(
  '/categories',
  isAuthenticated,
  new CreateCategoryController().handle
);
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

// Product routes (protected endpoints for admin)
router.post(
  '/products',
  isAuthenticated,
  upload.single('file'),
  new CreateProductController().handle
);
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
router.get('/orders/open-tables', isAuthenticated, new ListOpenTablesController().handle);
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

// Reservation routes
router.post(
  '/reservationsdashboard',
  isAuthenticated,
  new CreateReservationController().handle
);
router.get(
  '/reservationsdashboard',
  isAuthenticated,
  new ListReservationsController().handle
);
router.get(
  '/reservationsdashboard/:id',
  isAuthenticated,
  new DetailReservationController().handle
);
router.put(
  '/reservationsdashboard/:id',
  isAuthenticated,
  new UpdateReservationController().handle
);
router.delete(
  '/reservationsdashboard/:id',
  isAuthenticated,
  new DeleteReservationController().handle
);

// Reservation routes (using isAuthenticatedApp for user-app authentication)
router.post(
  '/reservations',
  isAuthenticatedApp,
  new CreateReservationController().handle
);
router.get(
  '/reservations',
  isAuthenticatedApp,
  new ListReservationsController().handle
);
router.get(
  '/reservations/:id',
  isAuthenticatedApp,
  new DetailReservationController().handle
);
router.put(
  '/reservations/:id',
  isAuthenticatedApp,
  new UpdateReservationController().handle
);
router.delete(
  '/reservations/:id',
  isAuthenticatedApp,
  new DeleteReservationController().handle
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
