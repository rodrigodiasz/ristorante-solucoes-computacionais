import { api } from '@/services/api';
import { getCookieServer } from '@/lib/cookieServer';
import { ReservationProps } from '@/lib/order.type';
import { ReservationsClient } from './components/ReservationsClient';

async function getReservations(): Promise<ReservationProps[] | []> {
  try {
    const token = await getCookieServer();
    const response = await api.get('/reservations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default async function ReservationsPage() {
  const reservations = await getReservations();

  return <ReservationsClient initialReservations={reservations} />;
}
