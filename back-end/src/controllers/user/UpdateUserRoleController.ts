import { Request, Response } from 'express';
import { UpdateUserRoleService } from '../../services/user/UpdateUserRoleService';

class UpdateUserRoleController {
  async handle(req: Request, res: Response) {
    const { user_id, role } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    if (!role) {
      return res.status(400).json({
        error: 'Role is required',
      });
    }

    const updateUserRoleService = new UpdateUserRoleService();

    try {
      const updatedUser = await updateUserRoleService.execute({
        user_id,
        role,
      });

      return res.json({
        message: 'User role updated successfully',
        user: updatedUser,
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { UpdateUserRoleController };
