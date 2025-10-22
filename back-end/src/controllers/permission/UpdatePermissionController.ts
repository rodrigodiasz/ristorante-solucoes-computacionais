import { Request, Response } from 'express';
import { UpdatePermissionService } from '../../services/permission/UpdatePermissionService';

class UpdatePermissionController {
  async handle(req: Request, res: Response) {
    const { role, route, can_access } = req.body;

    const updatePermissionService = new UpdatePermissionService();

    try {
      const updatedPermission = await updatePermissionService.execute({
        role,
        route,
        can_access,
      });
      return res.json(updatedPermission);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { UpdatePermissionController };
