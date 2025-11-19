import prismaClient from "../../../prisma";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { Category } from "../../../domain/entities/Category";
import { PrismaCategoryMapper } from "../../../domain/mappers/PrismaCategoryMapper";

export class PrismaCategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const data = PrismaCategoryMapper.toPrisma(category);
    const created = await prismaClient.category.create({ data: { name: data.name } as any });
    return PrismaCategoryMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<Category | null> {
    const found = await prismaClient.category.findUnique({ where: { id } });
    return found ? PrismaCategoryMapper.toDomain(found as any) : null;
  }

  async listAll(): Promise<Category[]> {
    const rows = await prismaClient.category.findMany({ orderBy: { created_at: "desc" } as any });
    return rows.map((r: any) => PrismaCategoryMapper.toDomain(r));
  }

  async update(category: Category): Promise<Category> {
    const data = PrismaCategoryMapper.toPrisma(category);
    const updated = await prismaClient.category.update({ where: { id: data.id as string }, data: { name: data.name } as any });
    return PrismaCategoryMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.category.delete({ where: { id } });
  }
}
