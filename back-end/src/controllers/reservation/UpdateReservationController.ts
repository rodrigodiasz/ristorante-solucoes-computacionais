import { Request, Response } from 'express';
import { UpdateReservationService } from '../../services/reservation/UpdateReservationService';

class UpdateReservationController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { date, time, people_count, status, notes } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Reservation ID is required' });
    }

    const updateReservationService = new UpdateReservationService();

    try {
      // Converter a data para o formato correto
      let dateObj: Date | undefined;
      if (date) {
        dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ error: 'Data inválida' });
        }
      }

      const updatedReservation = await updateReservationService.execute({
        reservation_id: id,
        date: dateObj,
        time,
        people_count,
        status,
        notes,
      });
      return res.json(updatedReservation);
    } catch (error: any) {
      console.error('Error updating reservation:', error);
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateReservationController };
