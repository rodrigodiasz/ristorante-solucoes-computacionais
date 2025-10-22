import prismaClient from '../../prisma';

interface GetFirstAllowedRouteRequest {
  role: 'ADMIN' | 'USER' | 'GARCOM' | 'COZINHA' | 'GERENTE';
}

class GetFirstAllowedRouteService {
  async execute({ role }: GetFirstAllowedRouteRequest): Promise<string> {
    if (role === 'ADMIN') {
      return '/dashboard';
    }

    const permission = await prismaClient.rolePermission.findFirst({
      where: {
        role: role,
        can_access: true,
      },
      orderBy: {
        route: 'asc',
      },
    });

    if (!permission) {
      return '/dashboard/unauthorized';
    }

    return permission.route;
  }
}

export { GetFirstAllowedRouteService };
