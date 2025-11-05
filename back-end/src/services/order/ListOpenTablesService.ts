import prismaClient from "../../prisma";

class ListOpenTablesService {
  async execute() {
    // Busca mesas ocupadas:
    // - draft: true (mesas abertas, ainda em rascunho)
    // - draft: false, status: false (pedidos enviados para cozinha, ainda não finalizados)
    const openOrders = await prismaClient.order.findMany({
      where: {
        OR: [
          { draft: true }, // Mesas abertas
          { draft: false, status: false }, // Pedidos enviados mas não finalizados
        ],
      },
      select: {
        table: true,
      },
      orderBy: {
        table: "asc",
      },
    });

    // Retorna apenas os números das mesas abertas
    return openOrders.map((order) => order.table);
  }
}

export { ListOpenTablesService };
