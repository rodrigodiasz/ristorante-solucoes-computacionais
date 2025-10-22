import prismaClient from '../../prisma';

class DeleteProductService {
  async execute(productId: string) {
    const product = await prismaClient.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const itemsCount = await prismaClient.item.count({
      where: {
        product_id: productId,
        order: {
          status: false, 
        },
      },
    });

    if (itemsCount > 0) {
      throw new Error(
        'Não é possível excluir produto que possui itens em pedidos ativos'
      );
    }

    await prismaClient.product.delete({
      where: {
        id: productId,
      },
    });

    return { message: 'Produto excluído com sucesso' };
  }
}

export { DeleteProductService };
