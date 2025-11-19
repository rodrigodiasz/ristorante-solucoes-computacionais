import { RolePermission } from "../entities/RolePermission";
import type { UserRole } from "../entities/User";

export interface IRolePermissionRepository {
  create(permission: RolePermission): Promise<RolePermission>;
  findById(id: string): Promise<RolePermission | null>;
  findByRoleAndRoute(role: UserRole, route: string): Promise<RolePermission | null>;
  listByRole(role: UserRole): Promise<RolePermission[]>;
  update(permission: RolePermission): Promise<RolePermission>;
  delete(id: string): Promise<void>;
}
