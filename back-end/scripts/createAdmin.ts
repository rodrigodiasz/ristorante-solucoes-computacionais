import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('Admin já existe:', existingAdmin.email);
      return;
    }

    const adminData = {
      name: 'Administrador',
      email: 'admin@ristorante.com',
      password: await hash('admin123', 8),
      role: 'ADMIN' as const,
    };

    const admin = await prisma.user.create({
      data: adminData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log('Admin criado com sucesso!');
    console.log('Email:', admin.email);
    console.log('Senha: admin123');
    console.log('IMPORTANTE: Altere a senha após o primeiro login!');
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
