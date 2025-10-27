import { Request, Response } from 'express';
import { CreateUsersAppService } from '../../services/usersapp/CreateUsersAppService';

class CreateUsersAppController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const createUsersAppService = new CreateUsersAppService();

    try {
      const user = await createUsersAppService.execute({
        name,
        email,
        password,
      });
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { CreateUsersAppController };
