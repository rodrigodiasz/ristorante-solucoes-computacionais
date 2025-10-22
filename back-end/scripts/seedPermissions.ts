import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPermissions() {
  try {
    console.log('Iniciando seed das permissões...');

    const routes = [
      '/dashboard',
      '/dashboard/table',
      '/dashboard/order',
      '/dashboard/category',
      '/dashboard/product',
      '/dashboard/kitchen',
      '/dashboard/management',
      '/dashboard/admin',
    ];
    
    const defaultPermissions = {
      ADMIN: routes, 
      GERENTE: routes.filter(route => route !== '/dashboard/admin'), 
      GARCOM: ['/dashboard/table', '/dashboard/order'], 
      COZINHA: ['/dashboard/kitchen'], 
      USER: ['/dashboard'], 
    };

    await prisma.rolePermission.deleteMany();
    console.log('Permissões existentes removidas');

    for (const [role, allowedRoutes] of Object.entries(defaultPermissions)) {
      for (const route of routes) {
        const canAccess = allowedRoutes.includes(route);

        await prisma.rolePermission.create({
          data: {
            role: role as any,
            route: route,
            can_access: canAccess,
          },
        });
      }
      console.log(`Permissões criadas para ${role}`);
    }

    console.log('Seed das permissões concluído com sucesso!');

    const permissions = await prisma.rolePermission.findMany({
      orderBy: [{ role: 'asc' }, { route: 'asc' }],
    });

    console.log('\n Resumo das permissões:');
    const groupedPermissions = permissions.reduce((acc, perm) => {
      if (!acc[perm.role]) acc[perm.role] = [];
      if (perm.can_access) acc[perm.role].push(perm.route);
      return acc;
    }, {} as Record<string, string[]>);

      for (const [role, routes] of Object.entries(groupedPermissions) as [string, string[]][]) {
          console.log(`\n${role}:`);
          routes.forEach(route => console.log(`${route}`));
      }
  } catch (error) {
    console.error('Erro ao fazer seed das permissões:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPermissions();
