export type OrderProps = {
  id?: string;
  table: number;
  status?: boolean;
  draft?: boolean;
  name?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class Order {
  private props: Required<Omit<OrderProps, "id" | "name" | "createdAt" | "updatedAt">> & {
    id?: string;
    name?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: OrderProps) {
    if (!Number.isInteger(props.table) || props.table <= 0) throw new Error("table inválida");
    this.props = {
      table: props.table,
      status: props.status ?? false,
      draft: props.draft ?? false,
      name: props.name ?? null,
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    } as any;
  }

  static create(input: OrderProps) {
    return new Order(input);
  }

  get id() { return this.props.id; }
  get table() { return this.props.table; }
  set table(v: number) { if (!Number.isInteger(v) || v <= 0) throw new Error("table inválida"); this.props.table = v; }
  get status() { return this.props.status; }
  set status(v: boolean) { this.props.status = v; }
  get draft() { return this.props.draft; }
  set draft(v: boolean) { this.props.draft = v; }
  get name() { return this.props.name ?? undefined; }
  set name(v: string | undefined) { this.props.name = v ?? null; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
