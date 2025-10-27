import { Request, Response } from 'express';
import { UpdateReservationService } from '../../services/reservation/UpdateReservationService';

class UpdateReservationController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { table_number, date, time, people_count, status, notes } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Reservation ID is required' });
    }

    const updateReservationService = new UpdateReservationService();

    try {
      const updatedReservation = await updateReservationService.execute({
        reservation_id: id,
        table_number,
        date: date ? new Date(date) : undefined,
        time,
        people_count,
        status,
        notes,
      });
      return res.json(updatedReservation);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateReservationController };
