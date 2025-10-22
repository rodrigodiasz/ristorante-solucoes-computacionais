import prismaClient from '../../prisma';

interface UpdateProductRequest {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category_id: string;
}

class UpdateProductService {
  async execute({
    id,
    name,
    price,
    description,
    banner,
    category_id,
  }: UpdateProductRequest) {
    const product = await prismaClient.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const category = await prismaClient.category.findUnique({
      where: {
        id: category_id,
      },
    });

    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    const updatedProduct = await prismaClient.product.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        price: price,
        description: description,
        banner: banner,
        category_id: category_id,
        updated_at: new Date(),
      },
      include: {
        category: true,
      },
    });

    return updatedProduct;
  }
}

export { UpdateProductService };
