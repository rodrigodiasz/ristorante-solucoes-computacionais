import { Request, Response } from 'express';
import { DeleteUserService } from '../../services/user/DeleteUserService';

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    const deleteUserService = new DeleteUserService();

    try {
      const result = await deleteUserService.execute({
        user_id,
      });

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { DeleteUserController };



