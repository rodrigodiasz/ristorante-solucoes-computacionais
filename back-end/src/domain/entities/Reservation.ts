export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type ReservationProps = {
  id?: string;
  userAppId: string;
  date: Date;
  time: string;
  peopleCount: number;
  status?: ReservationStatus | string;
  notes?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class Reservation {
  private props: Required<Omit<ReservationProps, "id" | "notes" | "createdAt" | "updatedAt">> & {
    id?: string;
    notes?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };

  private constructor(props: ReservationProps) {
    // Validações mínimas sem dependências externas
    if (!props.userAppId) throw new Error("userAppId é obrigatório");
    if (!(props.date instanceof Date) || isNaN(props.date.getTime())) throw new Error("date inválida");
    if (!props.time || typeof props.time !== "string") throw new Error("time é obrigatório");
    if (!Number.isInteger(props.peopleCount) || props.peopleCount <= 0) throw new Error("peopleCount inválido");

    this.props = {
      ...props,
      status: (props.status as ReservationStatus) ?? "PENDING",
    } as any;
  }

  static create(input: ReservationProps) {
    return new Reservation(input);
  }

  get id() { return this.props.id; }
  get userAppId() { return this.props.userAppId; }
  get date() { return this.props.date; }
  get time() { return this.props.time; }
  get peopleCount() { return this.props.peopleCount; }
  get status() { return this.props.status as ReservationStatus | string; }
  get notes() { return this.props.notes; }
  get createdAt() { return this.props.createdAt ?? undefined; }
  get updatedAt() { return this.props.updatedAt ?? undefined; }

  confirm() {
    if (this.props.status === "CANCELLED") {
      throw new Error("Não é possível confirmar uma reserva cancelada");
    }
    this.props.status = "CONFIRMED";
  }

  cancel() {
    this.props.status = "CANCELLED";
  }
}
