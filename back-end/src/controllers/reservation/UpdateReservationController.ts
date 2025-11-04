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
      console.log('UpdateReservationController - Request body:', req.body);
      
      // Converter a data para o formato correto
      let dateObj: Date | undefined;
      if (date) {
        // Se a data vem no formato YYYY-MM-DD, criar Date localmente
        // para evitar problemas de timezone
        if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Formato YYYY-MM-DD - criar Date com hora local 00:00:00
          const [year, month, day] = date.split('-').map(Number);
          dateObj = new Date(year, month - 1, day);
        } else {
          dateObj = new Date(date);
        }
        
        if (isNaN(dateObj.getTime())) {
          console.error('Invalid date:', date);
          return res.status(400).json({ error: 'Data inválida' });
        }
        
        console.log('Converted date:', dateObj.toISOString());
      }

      const updatedReservation = await updateReservationService.execute({
        reservation_id: id,
        date: dateObj,
        time,
        people_count,
        status,
        notes,
      });
      
      console.log('Reservation updated successfully:', updatedReservation.id);
      return res.json(updatedReservation);
    } catch (error: any) {
      console.error('Error updating reservation:', error);
      console.error('Error stack:', error.stack);
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateReservationController };
