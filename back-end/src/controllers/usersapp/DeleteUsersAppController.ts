import { Request, Response } from 'express';
import { DeleteUsersAppService } from '../../services/usersapp/DeleteUsersAppService';

class DeleteUsersAppController {
  async handle(req: Request, res: Response) {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    const deleteUsersAppService = new DeleteUsersAppService();

    try {
      const result = await deleteUsersAppService.execute({
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

export { DeleteUsersAppController };