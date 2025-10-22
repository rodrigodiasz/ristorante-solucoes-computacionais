import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';

interface UpdateUserRequest {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
}

class UpdateUserService {
  async execute({ user_id, name, email, password }: UpdateUserRequest) {
    // Verificar se o usuário existe
    const user = await prismaClient.user.findUnique({
      where: { id: user_id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Preparar dados para atualização
    const updateData: any = {};

    if (name) {
      updateData.name = name;
    }

    if (email) {
      // Verificar se o email já existe em outro usuário
      const emailExists = await prismaClient.user.findFirst({
        where: {
          email: email,
          id: { not: user_id },
        },
      });

      if (emailExists) {
        throw new Error('Email already exists');
      }

      updateData.email = email;
    }

    if (password) {
      const passwordHash = await hash(password, 8);
      updateData.password = passwordHash;
    }

    // Atualizar o usuário
    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: updateData,
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

export { UpdateUserService };
