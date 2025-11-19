export type ProductProps = {
  id?: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  categoryId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class Product {
  private props: Required<Omit<ProductProps, "id" | "createdAt" | "updatedAt">> & {
    id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: ProductProps) {
    if (!props.name) throw new Error("name é obrigatório");
    if (!props.price) throw new Error("price é obrigatório");
    if (!props.description) throw new Error("description é obrigatório");
    if (!props.banner) throw new Error("banner é obrigatório");
    if (!props.categoryId) throw new Error("categoryId é obrigatório");
    this.props = { ...props } as any;
  }

  static create(input: ProductProps) {
    return new Product(input);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  set name(v: string) { if (!v) throw new Error("name inválido"); this.props.name = v; }
  get price() { return this.props.price; }
  set price(v: string) { if (!v) throw new Error("price inválido"); this.props.price = v; }
  get description() { return this.props.description; }
  set description(v: string) { if (!v) throw new Error("description inválido"); this.props.description = v; }
  get banner() { return this.props.banner; }
  set banner(v: string) { if (!v) throw new Error("banner inválido"); this.props.banner = v; }
  get categoryId() { return this.props.categoryId; }
  set categoryId(v: string) { if (!v) throw new Error("categoryId inválido"); this.props.categoryId = v; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
