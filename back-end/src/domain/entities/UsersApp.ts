export type UsersAppProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class UsersApp {
  private props: Required<Omit<UsersAppProps, "id" | "createdAt" | "updatedAt">> & {
    id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: UsersAppProps) {
    if (!props.name) throw new Error("name é obrigatório");
    if (!props.email) throw new Error("email é obrigatório");
    if (!props.password) throw new Error("password é obrigatório");
    this.props = { ...props } as any;
  }

  static create(input: UsersAppProps) {
    return new UsersApp(input);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  set name(v: string) { if (!v) throw new Error("name inválido"); this.props.name = v; }
  get email() { return this.props.email; }
  set email(v: string) { if (!v) throw new Error("email inválido"); this.props.email = v; }
  get password() { return this.props.password; }
  set password(v: string) { if (!v) throw new Error("password inválido"); this.props.password = v; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
