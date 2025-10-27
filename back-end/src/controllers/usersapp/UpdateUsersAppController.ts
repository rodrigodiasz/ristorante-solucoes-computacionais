import { Request, Response } from 'express';
import { UpdateUsersAppService } from '../../services/usersapp/UpdateUsersAppService';

class UpdateUsersAppController {
  async handle(req: Request, res: Response) {
    const { user_id } = req.params;
    const { name, email, password } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    if (!name && !email && !password) {
      return res.status(400).json({
        error: 'At least one field (name, email or password) is required',
      });
    }

    const updateUsersAppService = new UpdateUsersAppService();

    try {
      const updatedUser = await updateUsersAppService.execute({
        user_id,
        name,
        email,
        password,
      });

      return res.json({
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { UpdateUsersAppController };