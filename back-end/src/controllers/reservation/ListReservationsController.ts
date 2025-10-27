import { Request, Response } from 'express';
import { ListReservationsService } from '../../services/reservation/ListReservationsService';

class ListReservationsController {
  async handle(req: Request, res: Response) {
    const listReservationsService = new ListReservationsService();
    const user_id = req.user_id;

    try {
      // When called from dashboard (isAuthenticated), list all reservations
      // When called from user-app (isAuthenticatedApp), filter by user
      const isDashboardRequest = !req.route?.path?.includes('user');
      const reservations = await listReservationsService.execute(
        user_id,
        !isDashboardRequest
      );
      return res.json(reservations);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListReservationsController };
