import prismaClient from '../../prisma';

class DeleteCategoryService {
  async execute(categoryId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    const productsWithActiveItems = await prismaClient.product.findMany({
      where: {
        category_id: categoryId,
        items: {
          some: {
            order: {
              status: false, 
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (productsWithActiveItems.length > 0) {
      throw new Error(
        'Não é possível excluir categoria que possui produtos com itens em pedidos ativos'
      );
    }

    await prismaClient.category.delete({
      where: {
        id: categoryId,
      },
    });

    return { message: 'Categoria excluída com sucesso' };
  }
}

export { DeleteCategoryService };
