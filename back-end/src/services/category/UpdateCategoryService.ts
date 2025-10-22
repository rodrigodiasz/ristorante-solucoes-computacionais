import prismaClient from '../../prisma';

interface UpdateCategoryRequest {
  id: string;
  name: string;
}

class UpdateCategoryService {
  async execute({ id, name }: UpdateCategoryRequest) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    const updatedCategory = await prismaClient.category.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        updated_at: new Date(),
      },
    });

    return updatedCategory;
  }
}

export { UpdateCategoryService };
