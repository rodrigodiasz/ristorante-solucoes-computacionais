import { Item } from "../entities/Item";

export interface IItemRepository {
  create(item: Item): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  listByOrder(orderId: string): Promise<Item[]>;
  update(item: Item): Promise<Item>;
  delete(id: string): Promise<void>;
}
