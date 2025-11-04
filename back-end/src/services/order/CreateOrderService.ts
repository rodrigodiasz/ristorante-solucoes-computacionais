import prismaClient from "../../prisma";

interface OrderRequest {
    table: number;
    name: string;
}

class CreateOrderService {
    async execute({ table, name }: OrderRequest) {
        // Busca as configurações do restaurante
        let settings = await prismaClient.restaurantSettings.findUnique({
            where: { id: 'restaurant_settings' },
        });

        // Se não existir, cria com valor padrão
        if (!settings) {
            settings = await prismaClient.restaurantSettings.create({
                data: {
                    id: 'restaurant_settings',
                    max_tables: 5,
                },
            });
        }

        // Valida se o número da mesa está dentro do limite
        if (table < 1 || table > settings.max_tables) {
            throw new Error(
                `O número da mesa deve estar entre 1 e ${settings.max_tables}`
            );
        }

        // Verifica se já existe um pedido para esta mesa
        const existingOrder = await prismaClient.order.findFirst({
            where: {
                table: table,
                draft: true,
            },
        });

        if (existingOrder) {
            throw new Error('Esta mesa já está aberta');
        }

        const order = await prismaClient.order.create({
            data: {
                table: table,
                name: name,
            },
        });

        return order;
    }
}

export { CreateOrderService };