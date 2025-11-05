import prismaClient from "../../prisma";

interface OrderRequest {
  table: number;
  name: string;
}

class CreateOrderService {
  async execute({ table, name }: OrderRequest) {
    // Busca as configurações do restaurante
    let settings = await prismaClient.restaurantSettings.findUnique({
      where: { id: "restaurant_settings" },
    });

    // Se não existir, cria com valor padrão
    if (!settings) {
      settings = await prismaClient.restaurantSettings.create({
        data: {
          id: "restaurant_settings",
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

    // Verifica se já existe um pedido ativo para esta mesa:
    // - draft: true (mesas abertas, ainda em rascunho)
    // - draft: false, status: false (pedidos enviados para cozinha, ainda não finalizados)
    const existingOrder = await prismaClient.order.findFirst({
      where: {
        table: table,
        OR: [
          { draft: true }, // Mesas abertas
          { draft: false, status: false }, // Pedidos enviados mas não finalizados
        ],
      },
    });

    if (existingOrder) {
      throw new Error("Esta mesa já está aberta");
    }

    const order = await prismaClient.order.create({
      data: {
        table: table,
        name: name,
        draft: true, // Mesas abertas devem ter draft: true
      },
    });

    return order;
  }
}

export { CreateOrderService };
