export type RestaurantSettingsProps = {
  id?: string; // defaults to "restaurant_settings"
  maxTables?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class RestaurantSettings {
  private props: Required<Omit<RestaurantSettingsProps, "id" | "createdAt" | "updatedAt">> & {
    id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: RestaurantSettingsProps) {
    this.props = {
      id: props.id ?? "restaurant_settings",
      maxTables: props.maxTables ?? 5,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    } as any;
  }

  static create(input: RestaurantSettingsProps = {}) {
    return new RestaurantSettings(input);
  }

  get id() { return this.props.id ?? "restaurant_settings"; }
  get maxTables() { return this.props.maxTables; }
  set maxTables(v: number) { if (!Number.isInteger(v) || v <= 0) throw new Error("maxTables inválido"); this.props.maxTables = v; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }
}
