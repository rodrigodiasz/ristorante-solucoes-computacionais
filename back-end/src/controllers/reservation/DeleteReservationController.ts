import { Request, Response } from 'express';
import { DeleteReservationService } from '../../services/reservation/DeleteReservationService';

class DeleteReservationController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Reservation ID is required' });
    }

    const deleteReservationService = new DeleteReservationService();

    try {
      const result = await deleteReservationService.execute(id);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteReservationController };
