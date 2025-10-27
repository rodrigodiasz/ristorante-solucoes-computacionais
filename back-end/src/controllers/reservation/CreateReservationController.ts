import { Request, Response } from 'express';
import { CreateReservationService } from '../../services/reservation/CreateReservationService';

class CreateReservationController {
  async handle(req: Request, res: Response) {
    console.log('CreateReservationController - Request body:', req.body);
    console.log(
      'CreateReservationController - User ID from token:',
      req.user_id
    );

    const { date, time, people_count, status, notes } = req.body;
    const user_app_id = req.user_id;

    if (!user_app_id) {
      console.error('No user ID found in request');
      return res.status(400).json({ error: 'User ID is required' });
    }

    const createReservationService = new CreateReservationService();

    try {
      const reservation = await createReservationService.execute({
        user_app_id,
        date: new Date(date),
        time,
        people_count,
        status,
        notes,
      });

      console.log('Reservation created, returning to client:', reservation.id);
      return res.json(reservation);
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateReservationController };
