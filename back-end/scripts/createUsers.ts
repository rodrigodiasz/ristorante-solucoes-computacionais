import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createUsers() {
  try {
    const existingUsers = await prisma.user.findMany();

    if (existingUsers.length > 0) {
      console.log('Usuários já existem no sistema:');
      existingUsers.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - ${user.role}`);
      });
      return;
    }

    const usersData = [
      {
        name: 'Administrador',
        email: 'admin@ristorante.com',
        password: 'admin123',
        role: 'ADMIN' as const,
      },
      {
        name: 'Gerente',
        email: 'gerente@ristorante.com',
        password: 'gerente123',
        role: 'GERENTE' as const,
      },
      {
        name: 'João Garçom',
        email: 'garcom@ristorante.com',
        password: 'garcom123',
        role: 'GARCOM' as const,
      },
      {
        name: 'Maria Cozinha',
        email: 'cozinha@ristorante.com',
        password: 'cozinha123',
        role: 'COZINHA' as const,
      },
      {
        name: 'Usuário Teste',
        email: 'user@ristorante.com',
        password: 'user123',
        role: 'USER' as const,
      },
    ];

    console.log('Criando usuários...');

    for (const userData of usersData) {
      const hashedPassword = await hash(userData.password, 8);

      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      console.log(`${user.name} criado - ${user.email} (${user.role})`);
    }

    console.log('\n Todos os usuários foram criados com sucesso!');
    console.log('\n Credenciais de acesso:');
    console.log(' Admin: admin@ristorante.com / admin123');
    console.log(' Gerente: gerente@ristorante.com / gerente123');
    console.log(' Garçom: garcom@ristorante.com / garcom123');
    console.log(' Cozinha: cozinha@ristorante.com / cozinha123');
    console.log(' Usuário: user@ristorante.com / user123');
    console.log('\n IMPORTANTE: Altere as senhas após o primeiro login!');
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
