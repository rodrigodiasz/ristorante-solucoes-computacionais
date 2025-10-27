import { Request, Response } from 'express';
import { AuthUsersAppService } from '../../services/usersapp/AuthUsersAppService';

class AuthUsersAppController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;

        const authUsersAppService = new AuthUsersAppService();

        try {
            const auth = await authUsersAppService.execute({
                email,
                password,
            });

            return res.json(auth);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

export { AuthUsersAppController };