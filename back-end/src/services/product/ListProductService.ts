import prismaClient from "../../prisma";

class ListProductService {
    async execute() {
        const products = await prismaClient.product.findMany();
        return products;
    }
}

export { ListProductService };