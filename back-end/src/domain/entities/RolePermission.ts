import type { UserRole } from "./User";

export type RolePermissionProps = {
  id?: string;
  role: UserRole;
  route: string;
  canAccess?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class RolePermission {
  private props: Required<Omit<RolePermissionProps, "id" | "createdAt" | "updatedAt" | "canAccess">> & {
    id?: string;
    canAccess?: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: RolePermissionProps) {
    if (!props.role) throw new Error("role é obrigatório");
    if (!props.route) throw new Error("route é obrigatório");
    this.props = {
      ...props,
      canAccess: props.canAccess ?? true,
    } as any;
  }

  static create(input: RolePermissionProps) {
    return new RolePermission(input);
  }

  get id() { return this.props.id; }
  get role() { return this.props.role; }
  set role(v: UserRole) { this.props.role = v; }
  get route() { return this.props.route; }
  set route(v: string) { if (!v) throw new Error("route inválido"); this.props.route = v; }
  get canAccess() { return this.props.canAccess ?? true; }
  set canAccess(v: boolean) { this.props.canAccess = v; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
