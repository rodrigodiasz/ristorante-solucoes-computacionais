"use client";

import { useState } from "react";
import { ReservationProps } from "@/lib/order.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Edit2, Trash2 } from "lucide-react";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";

interface ReservationsTableProps {
  reservations: ReservationProps[];
  onReservationUpdated: () => void;
}

export function ReservationsTable({
  reservations,
  onReservationUpdated,
}: ReservationsTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingReservation, setEditingReservation] =
    useState<ReservationProps | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
    people_count: 0,
    observations: "",
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      PENDING: "outline",
      CONFIRMED: "default",
      CANCELLED: "destructive",
    };

    const statusLabels: Record<string, string> = {
      PENDING: "Pendente",
      CONFIRMED: "Confirmada",
      CANCELLED: "Cancelada",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const handleUpdateStatus = async (
    reservationId: string,
    newStatus: string
  ) => {
    setUpdating(reservationId);

    try {
      const token = await getCookieClient();
      await api.put(
        `/reservationsdashboard/${reservationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `Reserva ${
          newStatus === "CONFIRMED" ? "confirmada" : "cancelada"
        } com sucesso!`
      );
      onReservationUpdated();
    } catch (error: any) {
      console.error("Erro ao atualizar reserva:", error);
      toast.error(error.response?.data?.error || "Erro ao atualizar reserva");
    } finally {
      setUpdating(null);
    }
  };

  const handleOpenEdit = (reservation: ReservationProps) => {
    setEditingReservation(reservation);

    // Converter a data para o formato YYYY-MM-DD para o input
    // Usar UTC para evitar problemas de timezone
    const dateObj = new Date(reservation.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setEditForm({
      date: formattedDate,
      time: reservation.time,
      people_count: reservation.people_count,
      observations: reservation.observations || reservation.notes || "",
    });
  };

  const handleCloseEdit = () => {
    setEditingReservation(null);
    setEditForm({
      date: "",
      time: "",
      people_count: 0,
      observations: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingReservation) return;

    setUpdating(editingReservation.id);

    try {
      const token = await getCookieClient();

      // Garantir que a data está no formato YYYY-MM-DD
      const dateToSend = editForm.date || "";

      console.log("Sending update request:", {
        date: dateToSend,
        time: editForm.time,
        people_count: editForm.people_count,
      });

      await api.put(
        `/reservationsdashboard/${editingReservation.id}`,
        {
          date: dateToSend,
          time: editForm.time,
          people_count: editForm.people_count,
          notes: editForm.observations,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Reserva atualizada com sucesso!");
      handleCloseEdit();
      onReservationUpdated();
    } catch (error: any) {
      console.error("Erro ao atualizar reserva:", error);
      toast.error(error.response?.data?.error || "Erro ao atualizar reserva");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (reservationId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    setUpdating(reservationId);

    try {
      const token = await getCookieClient();
      await api.put(
        `/reservationsdashboard/${reservationId}`,
        { status: "CANCELLED" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Reserva cancelada com sucesso!");
      onReservationUpdated();
    } catch (error: any) {
      console.error("Erro ao cancelar reserva:", error);
      toast.error(error.response?.data?.error || "Erro ao cancelar reserva");
    } finally {
      setUpdating(null);
    }
  };

  const handleCompleteReservation = async (reservationId: string) => {
    if (
      !confirm(
        "Confirmar a chegada do cliente e concluir a reserva? A reserva será deletada do banco de dados."
      )
    )
      return;

    setUpdating(reservationId);

    try {
      const token = await getCookieClient();
      await api.delete(`/reservationsdashboard/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Reserva concluída e removida com sucesso!");
      onReservationUpdated();
    } catch (error: any) {
      console.error("Erro ao concluir reserva:", error);
      toast.error(error.response?.data?.error || "Erro ao concluir reserva");
    } finally {
      setUpdating(null);
    }
  };

  const getReservationsByStatus = (status: string) => {
    return reservations.filter((r) => r.status === status);
  };

  const pendingReservations = getReservationsByStatus("PENDING");
  const confirmedReservations = getReservationsByStatus("CONFIRMED");
  const cancelledReservations = getReservationsByStatus("CANCELLED");

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma reserva encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          As reservas aparecerão aqui quando forem feitas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modal de Edição */}
      {editingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Editar Reserva
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) =>
                    setEditForm({ ...editForm, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Pessoas
                </label>
                <input
                  type="number"
                  min="1"
                  value={editForm.people_count}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      people_count: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observações
                </label>
                <textarea
                  value={editForm.observations}
                  onChange={(e) =>
                    setEditForm({ ...editForm, observations: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveEdit}
                disabled={updating === editingReservation.id}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {updating === editingReservation.id ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                onClick={handleCloseEdit}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Reservas Pendentes */}
      {pendingReservations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="text-amber-500" size={20} />
            Pendentes ({pendingReservations.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mesa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pessoas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Observações
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pendingReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.user_app.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {reservation.user_app.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.people_count} pessoa(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(reservation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(reservation.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.people_count} pessoa(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {reservation.observations || reservation.notes || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(reservation.id, "CONFIRMED")
                          }
                          disabled={updating === reservation.id}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          <Check size={14} className="mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleUpdateStatus(reservation.id, "CANCELLED")
                          }
                          disabled={updating === reservation.id}
                        >
                          <X size={14} className="mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservas Confirmadas */}
      {confirmedReservations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Check className="text-emerald-500" size={20} />
            Confirmadas ({confirmedReservations.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pessoas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {confirmedReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.user_app.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {reservation.user_app.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(reservation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(reservation.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.people_count} pessoa(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(reservation)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(reservation.id)}
                          disabled={updating === reservation.id}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          {updating === reservation.id ? (
                            <Clock className="animate-spin" size={16} />
                          ) : (
                            <X size={16} />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleCompleteReservation(reservation.id)
                          }
                          disabled={updating === reservation.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          title="Confirmar chegada do cliente"
                        >
                          {updating === reservation.id ? (
                            <Clock className="animate-spin" size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservas Canceladas */}
      {cancelledReservations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <X className="text-red-500" size={20} />
            Canceladas ({cancelledReservations.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mesa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pessoas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {cancelledReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 opacity-60"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.user_app.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {reservation.user_app.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.table_number
                          ? `Mesa ${reservation.table_number}`
                          : "Não atribuída"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(reservation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(reservation.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.people_count} pessoa(s)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
