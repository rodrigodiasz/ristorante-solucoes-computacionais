import { Request, Response } from "express";
import { CreateReservationService } from "../../services/reservation/CreateReservationService";

class CreateReservationController {
  async handle(req: Request, res: Response) {
    const { date, time, people_count, status, notes, user_app_id } = req.body;

    // Validações básicas
    if (!date || !time || !people_count) {
      return res.status(400).json({
        error: "Campos obrigatórios: date, time e people_count são necessários",
      });
    }

    // Se user_app_id não foi fornecido no body, usar o req.user_id (para quando usuário do app cria)
    // Se user_app_id foi fornecido no body, usar ele (para quando admin cria pelo dashboard)
    const finalUserAppId = user_app_id || req.user_id;

    if (!finalUserAppId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const createReservationService = new CreateReservationService();

    try {
      // Converter a data para o formato correto
      let dateObj: Date;

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

      const reservation = await createReservationService.execute({
        user_app_id: finalUserAppId,
        date: dateObj,
        time,
        people_count: parseInt(people_count),
        status: status || "PENDING",
        notes: notes || undefined,
      });

      return res.json(reservation);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || "Erro ao criar reserva",
      });
    }
  }
}

export { CreateReservationController };
