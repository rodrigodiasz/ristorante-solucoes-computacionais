import prismaClient from '../../prisma';

class ListUsersAppService {
  async execute() {
    const users = await prismaClient.usersApp.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  }
}

export { ListUsersAppService };
