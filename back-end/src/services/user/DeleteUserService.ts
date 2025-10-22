import prismaClient from '../../prisma';

interface DeleteUserRequest {
  user_id: string;
}

class DeleteUserService {
  async execute({ user_id }: DeleteUserRequest) {
    // Verificar se o usuário existe
    const user = await prismaClient.user.findUnique({
      where: { id: user_id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Deletar o usuário
    await prismaClient.user.delete({
      where: { id: user_id },
    });

    return {
      message: 'User deleted successfully',
      deletedUser: user,
    };
  }
}

export { DeleteUserService };
