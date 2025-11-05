import prismaClient from '../../prisma';

interface UpdatePermissionRequest {
  role: 'ADMIN' | 'USER' | 'GARCOM' | 'COZINHA' | 'GERENTE';
  route: string;
  can_access: boolean;
}

class UpdatePermissionService {
  async execute({ role, route, can_access }: UpdatePermissionRequest) {
    // Usa upsert para criar ou atualizar a permissão
    const updatedPermission = await prismaClient.rolePermission.upsert({
      where: {
        role_route: {
          role: role,
          route: route,
        },
      },
      update: {
        can_access: can_access,
        updated_at: new Date(),
      },
      create: {
        role: role,
        route: route,
        can_access: can_access,
      },
    });

    return updatedPermission;
  }
}

export { UpdatePermissionService };
