import { Request, Response } from 'express';
import { CheckPermissionService } from '../../services/permission/CheckPermissionService';

class CheckPermissionController {
  async handle(req: Request, res: Response) {
    const { role, route } = req.query;

    if (!role || !route) {
      return res.status(400).json({
        error: 'Role e route são obrigatórios',
      });
    }

    const checkPermissionService = new CheckPermissionService();

    try {
      const hasPermission = await checkPermissionService.execute({
        role: role as any,
        route: route as string,
      });
      return res.json({ hasPermission });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { CheckPermissionController };
