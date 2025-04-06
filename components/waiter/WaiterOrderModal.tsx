import { Order, OrderStatus, OrderAPI } from '@/types/Order';
import { useEffect, useState } from 'react';
import { getOrders } from '@/api/order';

interface Props {
  onCompletedOrders: (orders: OrderAPI[]) => void;
}

const WaiterOrderModal: React.FC<Props> = ({ onCompletedOrders }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders from API
        const response = await getOrders();
        const allOrders = response.data;
        
        // Filter completed orders
        const completedOrders = allOrders.filter(order => order.status === 4); // 4 is COMPLETED status
        
        // Send completed orders to parent component
        onCompletedOrders(completedOrders);
      } catch (err) {
        console.error('Error fetching completed orders:', err);
        setError('Không thể tải danh sách đơn hàng đã hoàn thành');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, [onCompletedOrders]);

  // Component doesn't render anything, just handles data fetching
  return null;
};

export default WaiterOrderModal;