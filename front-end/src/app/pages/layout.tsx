import { Header } from '../../components/header';
import { OrderProvider } from '@/providers/order';
import { Modal } from '../../components/modal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderProvider>
      <Header />
      {children}
      <Modal />
    </OrderProvider>
  );
}
