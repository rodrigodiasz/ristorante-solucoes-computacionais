import { Request, Response } from 'express';
import { DetailUsersAppService } from '../../services/usersapp/DetailUsersAppService';

class DetailUsersAppController {
    async handle(req: Request, res: Response) {
        const user_id = req.user_id;

        const detailUsersAppService = new DetailUsersAppService();

        try {
            const user = await detailUsersAppService.execute(user_id);
            return res.json(user);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

export { DetailUsersAppController };