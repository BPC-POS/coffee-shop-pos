import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Stack } from 'expo-router';
import AreaTableScreen from './Tables/index';
import { Ionicons } from '@expo/vector-icons';
import WaiterNotificationModal from '@/components/waiter/Modal/WaiterNotifyModal';
import { getOrders } from '@/api/order';
import { Order, OrderStatus, OrderAPI, OrderStatusAPI, PaymentStatus, PaymentMethod } from '@/types/Order';

const WaiterScreen = () => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState<Order[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [lastOrderIds, setLastOrderIds] = useState<number[]>([]);

  // Hàm lấy đơn hàng đã hoàn thành từ API
  const fetchCompletedOrders = async () => {
    try {
      const response = await getOrders();
      const allOrders = response.data;
      
      // Lọc các đơn hàng đã hoàn thành (status = COMPLETED)
      const completedOrders = allOrders.filter(order => order.status === OrderStatusAPI.COMPLETED);
      
      // Chuyển đổi từ OrderAPI sang Order
      const convertedOrders = completedOrders.map(order => ({
        id: order.id || 0,
        orderNumber: order.id?.toString() || '0',
        customerName: order.shipping_address || 'Khách hàng',
        customerPhone: '',
        tableId: order.meta?.table_id,
        items: order.items?.map(item => ({
          id: item.id || 0,
          productId: item.product_id,
          productName: item.product?.name || `Sản phẩm ${item.product_id}`,
          quantity: item.quantity,
          price: Number(item.unit_price),
          note: ''
        })) || [],
        status: OrderStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        totalAmount: Number(order.total_amount),
        createdAt: new Date(order.createdAt || order.order_date),
        updatedAt: new Date(order.updatedAt || order.order_date)
      }));
      
      // Kiểm tra xem có đơn hàng mới không
      const currentOrderIds = convertedOrders.map(order => order.id);
      const hasNewOrders = currentOrderIds.some(id => !lastOrderIds.includes(id));
      
      if (hasNewOrders) {
        setHasNewNotifications(true);
      }
      
      setNotifications(convertedOrders);
      setLastOrderIds(currentOrderIds);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    }
  };

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  // Cập nhật dữ liệu định kỳ (mỗi 10 giây)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCompletedOrders();
    }, 10000); // 10 giây

    return () => clearInterval(intervalId);
  }, []);

  // Xử lý khi đánh dấu đơn hàng là đã giao
  const handleMarkAsDelivered = (orderId: number) => {
    // Cập nhật danh sách đơn hàng đã xem
    setLastOrderIds(prev => [...prev, orderId]);
    
    // Kiểm tra xem còn đơn hàng mới nào không
    const remainingNewOrders = notifications.filter(
      order => !lastOrderIds.includes(order.id) && order.id !== orderId
    );
    
    if (remainingNewOrders.length === 0) {
      setHasNewNotifications(false);
    }
  };

  // Xử lý khi nhấn vào nút thông báo
  const handleNotificationPress = () => {
    setIsNotificationVisible(true);
    setHasNewNotifications(false); // Ẩn số hiển thị ngay khi nhấn vào nút
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Phục vụ',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={handleNotificationPress}>
              <Ionicons name="notifications-outline" size={24} color="white" style={{ marginRight: 10 }} />
              {hasNewNotifications && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <AreaTableScreen />

      {/* Hiển thị modal khi có thông báo */}
      <WaiterNotificationModal
        isVisible={isNotificationVisible}
        onClose={() => {
          setIsNotificationVisible(false);
        }}
        notifications={notifications}
        onMarkAsDelivered={handleMarkAsDelivered}
      />
    </View>
  );
};

export default WaiterScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
