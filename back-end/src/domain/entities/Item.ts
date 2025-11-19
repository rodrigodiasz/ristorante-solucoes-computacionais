export type ItemProps = {
  id?: string;
  amount: number;
  orderId: string;
  productId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class Item {
  private props: Required<Omit<ItemProps, "id" | "createdAt" | "updatedAt">> & {
    id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: ItemProps) {
    if (!Number.isInteger(props.amount) || props.amount <= 0) throw new Error("amount inválido");
    if (!props.orderId) throw new Error("orderId é obrigatório");
    if (!props.productId) throw new Error("productId é obrigatório");
    this.props = { ...props } as any;
  }

  static create(input: ItemProps) {
    return new Item(input);
  }

  get id() { return this.props.id; }
  get amount() { return this.props.amount; }
  set amount(v: number) { if (!Number.isInteger(v) || v <= 0) throw new Error("amount inválido"); this.props.amount = v; }
  get orderId() { return this.props.orderId; }
  set orderId(v: string) { if (!v) throw new Error("orderId inválido"); this.props.orderId = v; }
  get productId() { return this.props.productId; }
  set productId(v: string) { if (!v) throw new Error("productId inválido"); this.props.productId = v; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
