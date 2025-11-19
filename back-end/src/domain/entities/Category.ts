export type CategoryProps = {
  id?: string;
  name: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class Category {
  private props: Required<Omit<CategoryProps, "id" | "createdAt" | "updatedAt">> & {
    id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: CategoryProps) {
    if (!props.name || typeof props.name !== "string") throw new Error("name é obrigatório");
    this.props = { ...props } as any;
  }

  static create(input: CategoryProps) {
    return new Category(input);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  set name(v: string) { if (!v) throw new Error("name inválido"); this.props.name = v; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
