import prismaClient from "../../../prisma";
import { IUsersAppRepository } from "../../../domain/repositories/IUsersAppRepository";
import { UsersApp } from "../../../domain/entities/UsersApp";
import { PrismaUsersAppMapper } from "../../../domain/mappers/PrismaUsersAppMapper";

export class PrismaUsersAppRepository implements IUsersAppRepository {
  async create(user: UsersApp): Promise<UsersApp> {
    const data = PrismaUsersAppMapper.toPrisma(user);
    const created = await prismaClient.usersApp.create({
      data: {
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
      } as any,
    });
    return PrismaUsersAppMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<UsersApp | null> {
    const found = await prismaClient.usersApp.findUnique({ where: { id } });
    return found ? PrismaUsersAppMapper.toDomain(found as any) : null;
  }

  async findByEmail(email: string): Promise<UsersApp | null> {
    const found = await prismaClient.usersApp.findUnique({ where: { email } });
    return found ? PrismaUsersAppMapper.toDomain(found as any) : null;
  }

  async listAll(): Promise<UsersApp[]> {
    const rows = await prismaClient.usersApp.findMany({ orderBy: { created_at: "desc" } as any });
    return rows.map((r: any) => PrismaUsersAppMapper.toDomain(r));
  }

  async update(user: UsersApp): Promise<UsersApp> {
    const data = PrismaUsersAppMapper.toPrisma(user);
    const updated = await prismaClient.usersApp.update({
      where: { id: data.id as string },
      data: {
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
      } as any,
    });
    return PrismaUsersAppMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.usersApp.delete({ where: { id } });
  }
}
