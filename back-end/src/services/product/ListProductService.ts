import prismaClient from '../../prisma';

class ListProductService {
  async execute() {
    const products = await prismaClient.product.findMany({
      include: {
        category: true,
      },
    });
    return products;
  }
}

export { ListProductService };
