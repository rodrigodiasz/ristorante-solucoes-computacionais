import prismaClient from "../../prisma";

interface ProductRequest {
    name: string;
    price: string;
    description: string;
    banner: string;
    category_id: string;
}

class CreateProductService {
    async execute({
                      name,
                      price,
                      description,
                      banner,
                      category_id,
                  }: ProductRequest) {
        try {
            // Check if category exists
            const categoryExists = await prismaClient.category.findUnique({
                where: { id: category_id }
            });

            if (!categoryExists) {
                throw new Error(`Category with id ${category_id} not found`);
            }

            const product = await prismaClient.product.create({
                data: {
                    name: name,
                    price: price,
                    description: description,
                    banner: banner,
                    category_id: category_id,
                },
            });

            return product;
        } catch (error) {
            console.error("Error in CreateProductService:", error);
            throw error;
        }
    }
}

export { CreateProductService };