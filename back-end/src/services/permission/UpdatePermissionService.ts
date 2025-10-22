import prismaClient from '../../prisma';

interface UpdatePermissionRequest {
  role: 'ADMIN' | 'USER' | 'GARCOM' | 'COZINHA' | 'GERENTE';
  route: string;
  can_access: boolean;
}

class UpdatePermissionService {
  async execute({ role, route, can_access }: UpdatePermissionRequest) {
    const existingPermission = await prismaClient.rolePermission.findUnique({
      where: {
        role_route: {
          role: role,
          route: route,
        },
      },
    });

    if (!existingPermission) {
      throw new Error('Permissão não encontrada');
    }

    const updatedPermission = await prismaClient.rolePermission.update({
      where: {
        role_route: {
          role: role,
          route: route,
        },
      },
      data: {
        can_access: can_access,
        updated_at: new Date(),
      },
    });

    return updatedPermission;
  }
}

export { UpdatePermissionService };
