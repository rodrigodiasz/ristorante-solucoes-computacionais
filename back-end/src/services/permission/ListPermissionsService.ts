import prismaClient from '../../prisma';

class ListPermissionsService {
  async execute() {
    const permissions = await prismaClient.rolePermission.findMany({
      orderBy: [{ role: 'asc' }, { route: 'asc' }],
    });

    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.role]) {
        acc[permission.role] = [];
      }
      acc[permission.role].push({
        route: permission.route,
        can_access: permission.can_access,
      });
      return acc;
    }, {} as Record<string, Array<{ route: string; can_access: boolean }>>);

    return groupedPermissions;
  }
}

export { ListPermissionsService };
