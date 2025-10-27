import prismaClient from '../../prisma';

interface DeleteUserRequest {
  user_id: string;
}

class DeleteUsersAppService {
  async execute({ user_id }: DeleteUserRequest) {
    // Verificar se o usuário existe
    const user = await prismaClient.usersApp.findUnique({
      where: { id: user_id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Deletar o usuário
    await prismaClient.usersApp.delete({
      where: { id: user_id },
    });

    return {
      message: 'User deleted successfully',
      deletedUser: user,
    };
  }
}

export { DeleteUsersAppService };
