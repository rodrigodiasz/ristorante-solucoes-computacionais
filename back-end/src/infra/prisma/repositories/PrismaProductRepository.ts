import prismaClient from "../../../prisma";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Product } from "../../../domain/entities/Product";
import { PrismaProductMapper } from "../../../domain/mappers/PrismaProductMapper";

export class PrismaProductRepository implements IProductRepository {
  async create(product: Product): Promise<Product> {
    const data = PrismaProductMapper.toPrisma(product);
    const created = await prismaClient.product.create({
      data: {
        name: data.name,
        price: data.price as any,
        description: data.description as string,
        banner: data.banner as string,
        category_id: data.category_id as string,
      } as any,
    });
    return PrismaProductMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<Product | null> {
    const found = await prismaClient.product.findUnique({ where: { id } });
    return found ? PrismaProductMapper.toDomain(found as any) : null;
  }

  async listAll(): Promise<Product[]> {
    const rows = await prismaClient.product.findMany({ orderBy: { created_at: "desc" } as any });
    return rows.map((r: any) => PrismaProductMapper.toDomain(r));
  }

  async listByCategory(categoryId: string): Promise<Product[]> {
    const rows = await prismaClient.product.findMany({ where: { category_id: categoryId } });
    return rows.map((r: any) => PrismaProductMapper.toDomain(r));
  }

  async update(product: Product): Promise<Product> {
    const data = PrismaProductMapper.toPrisma(product);
    const updated = await prismaClient.product.update({
      where: { id: data.id as string },
      data: {
        name: data.name,
        price: data.price as any,
        description: data.description as string,
        banner: data.banner as string,
        category_id: data.category_id as string,
      } as any,
    });
    return PrismaProductMapper.toDomain(updated as any);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.product.delete({ where: { id } });
  }
}
