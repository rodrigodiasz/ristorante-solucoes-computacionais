import { Request, Response } from 'express';
import { ListUsersService } from '../../services/user/ListUsersService';

class ListUsersController {
  async handle(req: Request, res: Response) {
    const listUsersService = new ListUsersService();

    try {
      const users = await listUsersService.execute();
      return res.json(users);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { ListUsersController };
