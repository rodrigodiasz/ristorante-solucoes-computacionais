import prismaClient from "../../../prisma";
import { IRolePermissionRepository } from "../../../domain/repositories/IRolePermissionRepository";
import { RolePermission } from "../../../domain/entities/RolePermission";
import { PrismaRolePermissionMapper } from "../../../domain/mappers/PrismaRolePermissionMapper";
import type { UserRole } from "../../../domain/entities/User";

export class PrismaRolePermissionRepository implements IRolePermissionRepository {
  async create(permission: RolePermission): Promise<RolePermission> {
    const data = PrismaRolePermissionMapper.toPrisma(permission);
    const created = await prismaClient.rolePermission.create({
      data: {
        role: data.role as any,
        route: data.route as string,
        can_access: data.can_access as boolean,
      } as any,
    });
    return PrismaRolePermissionMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<RolePermission | null> {
    const found = await prismaClient.rolePermission.findUnique({ where: { id } });
    return found ? PrismaRolePermissionMapper.toDomain(found as any) : null;
  }

  async findByRoleAndRoute(role: UserRole, route: string): Promise<RolePermission | null> {
    const found = await prismaClient.rolePermission.findUnique({ where: { role_route: { role: role as any, route } } as any });
    return found ? PrismaRolePermissionMapper.toDomain(found as any) : null;
  }

  async listByRole(role: UserRole): Promise<RolePermission[]> {
    const rows = await prismaClient.rolePermission.findMany({ where: { role: role as any } });
    return rows.map((r: any) => PrismaRolePermissionMapper.toDomain(r));
  }

  async update(permission: RolePermission): Promise<RolePermission> {
    const data = PrismaRolePermissionMapper.toPrisma(permission);
    const updated = await prismaClient.rolePermission.update({
      where: { id: data.id as string },
      data: {
        role: data.role as any,
        route: data.route as string,
        can_access: data.can_access as boolean,
      } as any,
    });
    return PrismaRolePermissionMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.rolePermission.delete({ where: { id } });
  }
}
