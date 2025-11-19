import { RolePermission } from "../entities/RolePermission";
// @ts-ignore
import { RolePermission as PrismaRolePermission } from "@prisma/client";

export class PrismaRolePermissionMapper {
  static toDomain(r: PrismaRolePermission): RolePermission {
    return RolePermission.create({
      id: r.id,
      role: r.role as any,
      route: r.route,
      canAccess: r.can_access,
      createdAt: r.created_at ?? undefined,
      updatedAt: r.updated_at ?? undefined,
    });
  }

  static toPrisma(entity: RolePermission) {
    return {
      id: entity.id,
      role: entity.role as any,
      route: entity.route,
      can_access: entity.canAccess,
      created_at: entity.createdAt ?? undefined,
      updated_at: entity.updatedAt ?? undefined,
    };
  }
}
