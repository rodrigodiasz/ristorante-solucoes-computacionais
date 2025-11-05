import { Request, Response } from "express";
import { ListOpenTablesService } from "../../services/order/ListOpenTablesService";

class ListOpenTablesController {
  async handle(req: Request, res: Response) {
    try {
      const listOpenTablesService = new ListOpenTablesService();
      const openTables = await listOpenTablesService.execute();
      return res.json(openTables);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { ListOpenTablesController };
