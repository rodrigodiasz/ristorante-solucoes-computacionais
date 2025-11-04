import { Request, Response } from "express";
import { CreateReservationService } from "../../services/reservation/CreateReservationService";

class CreateReservationController {
  async handle(req: Request, res: Response) {
    console.log("CreateReservationController - Request body:", req.body);
    console.log(
      "CreateReservationController - User ID from token:",
      req.user_id
    );

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
      console.error("No user ID found in request");
      return res.status(400).json({ error: "User ID is required" });
    }

    const createReservationService = new CreateReservationService();

    try {
      // Converter a data para o formato correto
      const dateObj = new Date(date);
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

      console.log("Reservation created, returning to client:", reservation.id);
      return res.json(reservation);
    } catch (error: any) {
      console.error("Error creating reservation:", error);
      console.error("Error stack:", error.stack);
      return res.status(400).json({
        error: error.message || "Erro ao criar reserva",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }
}

export { CreateReservationController };
