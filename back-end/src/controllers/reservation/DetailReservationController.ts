import { Request, Response } from 'express';
import { DetailReservationService } from '../../services/reservation/DetailReservationService';

class DetailReservationController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Reservation ID is required' });
    }

    const detailReservationService = new DetailReservationService();

    try {
      const reservation = await detailReservationService.execute(id);
      return res.json(reservation);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DetailReservationController };
