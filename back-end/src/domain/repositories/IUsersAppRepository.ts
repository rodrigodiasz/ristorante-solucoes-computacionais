import { UsersApp } from "../entities/UsersApp";

export interface IUsersAppRepository {
  create(user: UsersApp): Promise<UsersApp>;
  findById(id: string): Promise<UsersApp | null>;
  findByEmail(email: string): Promise<UsersApp | null>;
  listAll(): Promise<UsersApp[]>;
  update(user: UsersApp): Promise<UsersApp>;
  delete(id: string): Promise<void>;
}
