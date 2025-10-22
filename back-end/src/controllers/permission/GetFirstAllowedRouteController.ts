import { Request, Response } from 'express';
import { GetFirstAllowedRouteService } from '../../services/permission/GetFirstAllowedRouteService';

class GetFirstAllowedRouteController {
  async handle(req: Request, res: Response) {
    const { role } = req.query;

    if (!role) {
      return res.status(400).json({
        error: 'Role é obrigatório',
      });
    }

    const getFirstAllowedRouteService = new GetFirstAllowedRouteService();

    try {
      const firstRoute = await getFirstAllowedRouteService.execute({
        role: role as any,
      });
      return res.json({ route: firstRoute });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { GetFirstAllowedRouteController };
