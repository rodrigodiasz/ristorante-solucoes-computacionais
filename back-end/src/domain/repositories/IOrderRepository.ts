import { Order } from "../entities/Order";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  listOpen(): Promise<Order[]>; // draft=false and status=false
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
}
