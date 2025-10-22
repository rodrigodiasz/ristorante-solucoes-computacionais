import prismaClient from '../../prisma';

interface CheckPermissionRequest {
  role: 'ADMIN' | 'USER' | 'GARCOM' | 'COZINHA' | 'GERENTE';
  route: string;
}

class CheckPermissionService {
  async execute({ role, route }: CheckPermissionRequest): Promise<boolean> {
    if (role === 'ADMIN') {
      return true;
    }

    const permission = await prismaClient.rolePermission.findUnique({
      where: {
        role_route: {
          role: role,
          route: route,
        },
      },
    });

    if (!permission) {
      return false;
    }

    return permission.can_access;
  }
}

export { CheckPermissionService };
