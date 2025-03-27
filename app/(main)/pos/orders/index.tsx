import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Stack } from 'expo-router';
import OrderStats from '@/components/order/OrderStats';
import OrderFilter from '@/components/order/OrderFilter';
import { OrderFilter as OrderFilterType, Order, OrderStatus, PaymentStatus, OrderAPI, OrderStatusAPI } from '@/types/Order';
import OrderList from '@/components/order/OrderList';
import { ScrollView } from 'react-native-gesture-handler';
import { getOrders, updateOrderStatus } from '@/api/order';

// Hàm mapper để chuyển đổi từ OrderAPI sang Order để hiển thị
const mapAPIOrderToOrder = (apiOrder: OrderAPI): Order => {
  let orderStatus = OrderStatus.PENDING;
  
  // Chuyển đổi từ OrderStatusAPI sang OrderStatus
  switch (apiOrder.status) {
    case OrderStatusAPI.CONFIRMED:
      orderStatus = OrderStatus.CONFIRMED;
      break;
    case OrderStatusAPI.PREPARING:
      orderStatus = OrderStatus.PREPARING;
      break;
    case OrderStatusAPI.READY:
      orderStatus = OrderStatus.READY;
      break;
    case OrderStatusAPI.COMPLETED:
      orderStatus = OrderStatus.COMPLETED;
      break;
    case OrderStatusAPI.CANCELLED:
      orderStatus = OrderStatus.CANCELLED;
      break;
    case OrderStatusAPI.PENDING:
    default:
      orderStatus = OrderStatus.PENDING;
  }

  // Chuyển đổi trạng thái thanh toán, giả định mặc định là PAID
  let paymentStatus = PaymentStatus.PAID;

  return {
    id: apiOrder.id || 0,
    orderNumber: apiOrder.id?.toString() || '0',
    customerName: apiOrder.shipping_address || 'Khách hàng',
    customerPhone: apiOrder.payment_info || '',
    tableId: apiOrder.meta?.table_id,
    items: (apiOrder.orderItems || apiOrder.items || []).map((item, index) => ({
      id: item.id || index,
      productId: item.product_id,
      productName: item.product_name || item.product?.name || `Sản phẩm ${item.product_id}`,
      quantity: item.quantity,
      price: Number(item.unit_price),
      note: ''
    })),
    status: orderStatus,
    paymentStatus: paymentStatus,
    totalAmount: Number(apiOrder.total_amount),
    createdAt: new Date(apiOrder.createdAt || apiOrder.order_date),
    updatedAt: new Date(apiOrder.updatedAt || apiOrder.order_date)
  };
};

const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<OrderFilterType>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      const mappedOrders = response.data.map(mapAPIOrderToOrder);
      setOrders(mappedOrders);
      console.log("Fetched orders:", mappedOrders.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: OrderFilterType) => {
    console.log("OrderScreen - handleFilterChange - newFilter", newFilter);
    setOrderFilter(newFilter);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (orderFilter.search) {
        const search = orderFilter.search.toLowerCase();
        if (
          !order.customerName.toLowerCase().includes(search) &&
          !order.orderNumber.toLowerCase().includes(search) &&
          !order.customerPhone?.includes(search)
        ) {
          return false;
        }
      }
      if (orderFilter.status && order.status !== orderFilter.status) {
        return false;
      }
      if (orderFilter.paymentStatus && order.paymentStatus !== orderFilter.paymentStatus) {
        return false;
      }
      if (orderFilter.startDate && order.createdAt < orderFilter.startDate) {
        return false;
      }
      if(orderFilter.endDate && order.createdAt > orderFilter.endDate) {
        return false;
      }
      return true;
    });
  }, [orders, orderFilter]);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      // Chuyển đổi từ OrderStatus sang OrderStatusAPI
      let apiStatus: OrderStatusAPI;
      
      switch(status) {
        case OrderStatus.PENDING:
          apiStatus = OrderStatusAPI.PENDING; // 6
          break;
        case OrderStatus.CONFIRMED:
          apiStatus = OrderStatusAPI.CONFIRMED; // 1
          break;
        case OrderStatus.PREPARING:
          apiStatus = OrderStatusAPI.PREPARING; // 2
          break;
        case OrderStatus.READY:
          apiStatus = OrderStatusAPI.READY; // 3
          break;
        case OrderStatus.COMPLETED:
          apiStatus = OrderStatusAPI.COMPLETED; // 4
          break;
        case OrderStatus.CANCELLED:
          apiStatus = OrderStatusAPI.CANCELLED; // 5
          break;
        default:
          apiStatus = OrderStatusAPI.PENDING;
      }
      
      // Gọi API cập nhật trạng thái
      await updateOrderStatus(orderId, apiStatus);
      
      // Cập nhật lại state orders
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: status }
          : order
      ));
      
      Alert.alert("Thành công", `Đã cập nhật trạng thái đơn hàng #${orderId} thành ${status}`);
      
      // Nếu chuyển trạng thái sang "Đang pha chế", có thể làm thêm logic nếu cần
      if (status === OrderStatus.PREPARING) {
        console.log(`Đơn hàng #${orderId} đã chuyển sang trạng thái đang pha chế`);
        // Có thể thêm logic như gửi thông báo đến barista, cập nhật giao diện, v.v.
      }
      
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handlePaymentStatusChange = async (orderId: number, status: PaymentStatus) => {
    // TODO: Triển khai cập nhật trạng thái thanh toán
    console.log("Update payment status:", orderId, status);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Danh sách đơn hàng',
          headerStyle: {
            backgroundColor: '#28a745',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView style={styles.content}>
        <OrderStats orders={filteredOrders} />
        <OrderFilter
          filter={orderFilter}
          onFilterChange={handleFilterChange}
        />
        <OrderList 
          orders={filteredOrders} 
          onViewDetail={(order) => {
            console.log("View order detail:", order.id);
            // TODO: Chuyển hướng đến trang chi tiết đơn hàng
          }} 
          onStatusChange={handleStatusChange} 
          onPaymentStatusChange={handlePaymentStatusChange} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default OrdersScreen;