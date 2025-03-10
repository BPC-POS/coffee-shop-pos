import { Order, OrderStatus } from '@/types/Order';
import { useEffect } from 'react';
import { mockOrders } from '@/mock/mockdata'; // Import mock data

class WaiterOrderModel {
  private orders: Order[];

  constructor(orders: Order[]) {
    this.orders = orders;
  }

  // Lấy danh sách đơn hàng đã hoàn thành
  getCompletedOrders(): Order[] {
    return this.orders.filter(order => order.status === OrderStatus.COMPLETED);
  }
}

const WaiterOrderModal: React.FC<{ onCompletedOrders: (orders: Order[]) => void }> = ({ onCompletedOrders }) => {
  useEffect(() => {
    // Khởi tạo model với mock data
    const orderModel = new WaiterOrderModel(mockOrders);

    // Lấy danh sách đơn hàng đã hoàn thành
    const completedOrders = orderModel.getCompletedOrders();

    // Gửi danh sách đơn hàng lên OrderScreen
    onCompletedOrders(completedOrders);
  }, [onCompletedOrders]);

  return null; // Không hiển thị UI, chỉ dùng để truyền dữ liệu
};

export default WaiterOrderModal;