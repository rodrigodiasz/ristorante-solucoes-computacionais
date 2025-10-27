import prismaClient from '../../prisma';

class DetailUsersAppService {
  async execute(user_id: string) {
    const user = await prismaClient.usersApp.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  }
}

export { DetailUsersAppService };
