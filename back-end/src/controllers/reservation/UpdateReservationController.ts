import { Request, Response } from "express";
import { UpdateReservationService } from "../../services/reservation/UpdateReservationService";

class UpdateReservationController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { date, time, people_count, status, notes } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Reservation ID is required" });
    }

    const updateReservationService = new UpdateReservationService();

    try {
      // Converter a data para o formato correto
      let dateObj: Date | undefined;
      if (date) {
        // Se a data vem no formato YYYY-MM-DD, criar Date em UTC
        // para evitar problemas de timezone
        if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Formato YYYY-MM-DD - criar Date em UTC às 12:00:00 para evitar mudança de dia
          const [year, month, day] = date.split("-").map(Number);
          dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        } else {
          dateObj = new Date(date);
        }

        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ error: "Data inválida" });
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
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateReservationController };
