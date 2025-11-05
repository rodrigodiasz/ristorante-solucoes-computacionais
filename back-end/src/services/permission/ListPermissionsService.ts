import prismaClient from '../../prisma';

const ROUTES = [
  '/dashboard',
  '/dashboard/table',
  '/dashboard/order',
  '/dashboard/category',
  '/dashboard/product',
  '/dashboard/kitchen',
  '/dashboard/admin',
];

const ROLES = ['ADMIN', 'USER', 'GARCOM', 'COZINHA', 'GERENTE'] as const;

// Permissões padrão por role
const DEFAULT_PERMISSIONS: Record<string, Record<string, boolean>> = {
  ADMIN: {
    '/dashboard': true,
    '/dashboard/table': true,
    '/dashboard/order': true,
    '/dashboard/category': true,
    '/dashboard/product': true,
    '/dashboard/kitchen': true,
    '/dashboard/admin': true,
  },
  GERENTE: {
    '/dashboard': true,
    '/dashboard/table': true,
    '/dashboard/order': true,
    '/dashboard/category': true,
    '/dashboard/product': true,
    '/dashboard/kitchen': true,
    '/dashboard/admin': false,
  },
  GARCOM: {
    '/dashboard': true,
    '/dashboard/table': true,
    '/dashboard/order': true,
    '/dashboard/category': false,
    '/dashboard/product': false,
    '/dashboard/kitchen': false,
    '/dashboard/admin': false,
  },
  COZINHA: {
    '/dashboard': false,
    '/dashboard/table': false,
    '/dashboard/order': false,
    '/dashboard/category': false,
    '/dashboard/product': false,
    '/dashboard/kitchen': true,
    '/dashboard/admin': false,
  },
  USER: {
    '/dashboard': true,
    '/dashboard/table': false,
    '/dashboard/order': false,
    '/dashboard/category': false,
    '/dashboard/product': true,
    '/dashboard/kitchen': false,
    '/dashboard/admin': false,
  },
};

class ListPermissionsService {
  async execute() {
    // Verifica se já existem permissões
    const existingPermissions = await prismaClient.rolePermission.findMany({
      orderBy: [{ role: 'asc' }, { route: 'asc' }],
    });

    // Se não houver permissões, inicializa com valores padrão
    if (existingPermissions.length === 0) {
      await this.initializePermissions();
      // Busca novamente após inicializar
      const permissions = await prismaClient.rolePermission.findMany({
        orderBy: [{ role: 'asc' }, { route: 'asc' }],
      });

      return this.groupPermissions(permissions);
    }

    return this.groupPermissions(existingPermissions);
  }

  private async initializePermissions() {
    const permissionsToCreate = [];

    for (const role of ROLES) {
      const rolePermissions = DEFAULT_PERMISSIONS[role] || {};
      
      for (const route of ROUTES) {
        const canAccess = rolePermissions[route] ?? false;
        permissionsToCreate.push({
          role,
          route,
          can_access: canAccess,
        });
      }
    }

    // Cria todas as permissões em uma única transação
    await prismaClient.rolePermission.createMany({
      data: permissionsToCreate,
      skipDuplicates: true,
    });
  }

  private groupPermissions(
    permissions: Array<{
      role: string;
      route: string;
      can_access: boolean;
    }>
  ) {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.role]) {
        acc[permission.role] = [];
      }
      acc[permission.role].push({
        route: permission.route,
        can_access: permission.can_access,
      });
      return acc;
    }, {} as Record<string, Array<{ route: string; can_access: boolean }>>);
  }
}

export { ListPermissionsService };
