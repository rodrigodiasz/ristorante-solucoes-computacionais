import { Request, Response } from 'express';
import { ListUsersAppService } from '../../services/usersapp/ListUsersAppService';

class ListUsersAppController {
  async handle(req: Request, res: Response) {
    const listUsersAppService = new ListUsersAppService();

    try {
      const users = await listUsersAppService.execute();
      return res.json(users);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { ListUsersAppController };