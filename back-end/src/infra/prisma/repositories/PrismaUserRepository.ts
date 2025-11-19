import prismaClient from "../../../prisma";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { PrismaUserMapper } from "../../../domain/mappers/PrismaUserMapper";

export class PrismaUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user);
    const created = await prismaClient.user.create({
      data: {
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
        role: data.role as any,
      } as any,
    });
    return PrismaUserMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<User | null> {
    const found = await prismaClient.user.findUnique({ where: { id } });
    return found ? PrismaUserMapper.toDomain(found as any) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prismaClient.user.findUnique({ where: { email } });
    return found ? PrismaUserMapper.toDomain(found as any) : null;
  }

  async listAll(): Promise<User[]> {
    const rows = await prismaClient.user.findMany({ orderBy: { created_at: "desc" } as any });
    return rows.map((r: any) => PrismaUserMapper.toDomain(r));
  }

  async update(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user);
    const updated = await prismaClient.user.update({
      where: { id: data.id as string },
      data: {
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
        role: data.role as any,
      } as any,
    });
    return PrismaUserMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.user.delete({ where: { id } });
  }
}
