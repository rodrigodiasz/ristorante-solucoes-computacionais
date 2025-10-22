import prismaClient from '../../prisma';

interface UpdateUserRoleRequest {
  user_id: string;
  role: 'ADMIN' | 'USER' | 'GARCOM' | 'COZINHA' | 'GERENTE';
}

class UpdateUserRoleService {
  async execute({ user_id, role }: UpdateUserRoleRequest) {
    // Verificar se o usuário existe
    const user = await prismaClient.user.findUnique({
      where: { id: user_id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verificar se o role é válido
    if (!['ADMIN', 'USER', 'GARCOM', 'COZINHA', 'GERENTE'].includes(role)) {
      throw new Error(
        'Invalid role. Must be ADMIN, USER, GARCOM, COZINHA or GERENTE'
      );
    }

    // Atualizar o role do usuário
    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }
}

export { UpdateUserRoleService };
