import { UsersApp } from "../entities/UsersApp";
// @ts-ignore
import { UsersApp as PrismaUsersApp } from "@prisma/client";

export class PrismaUsersAppMapper {
  static toDomain(r: PrismaUsersApp): UsersApp {
    return UsersApp.create({
      id: r.id,
      name: r.name,
      email: r.email,
      password: r.password,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: UsersApp) {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
