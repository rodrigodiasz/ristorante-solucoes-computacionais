import { Request, Response } from 'express';
import { ListPermissionsService } from '../../services/permission/ListPermissionsService';

class ListPermissionsController {
  async handle(req: Request, res: Response) {
    const listPermissionsService = new ListPermissionsService();

    try {
      const permissions = await listPermissionsService.execute();
      return res.json(permissions);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { ListPermissionsController };
