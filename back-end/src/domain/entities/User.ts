export type UserRole = "ADMIN" | "USER" | "GARCOM" | "COZINHA" | "GERENTE";

export type UserProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class User {
  private props: Required<Omit<UserProps, "id" | "createdAt" | "updatedAt" | "role">> & {
    id?: string;
    role?: UserRole;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: UserProps) {
    if (!props.name) throw new Error("name é obrigatório");
    if (!props.email) throw new Error("email é obrigatório");
    if (!props.password) throw new Error("password é obrigatório");
    this.props = {
      ...props,
      role: props.role ?? "USER",
    } as any;
  }

  static create(input: UserProps) {
    return new User(input);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  set name(v: string) { if (!v) throw new Error("name inválido"); this.props.name = v; }
  get email() { return this.props.email; }
  set email(v: string) { if (!v) throw new Error("email inválido"); this.props.email = v; }
  get password() { return this.props.password; }
  set password(v: string) { if (!v) throw new Error("password inválido"); this.props.password = v; }
  get role() { return this.props.role ?? "USER"; }
  set role(v: UserRole) { this.props.role = v; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
