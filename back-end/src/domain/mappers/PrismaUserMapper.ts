import { User } from "../entities/User";
// @ts-ignore
import { User as PrismaUser } from "@prisma/client";

export class PrismaUserMapper {
  static toDomain(r: PrismaUser): User {
    return User.create({
      id: r.id,
      name: r.name,
      email: r.email,
      password: r.password,
      role: r.role as any,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: User) {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role as any,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
