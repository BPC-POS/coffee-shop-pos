import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import AreaTableScreen from './Tables/index'; // Đảm bảo đúng đường dẫn
import { Ionicons } from '@expo/vector-icons';
import WaiterNotificationModal from '@/components/waiter/Modal/WaiterNotifyModal';
import { Order, OrderStatus, PaymentStatus } from '@/types/Order';

const WaiterScreen = () => {
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [notifications, setNotifications] = useState<Order[]>([]);

  // Giả lập danh sách đơn hàng cần phục vụ
  const handleOpenNotificationModal = () => {
    const fakeOrders: Order[] = [
      { id: 1, orderNumber: 'OD-12345', customerName: 'Khách A', tableId: 101, items: [], status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID, totalAmount: 500000, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, orderNumber: 'OD-12346', customerName: 'Khách B', tableId: 102, items: [], status: OrderStatus.PREPARING, paymentStatus: PaymentStatus.UNPAID, totalAmount: 300000, createdAt: new Date(), updatedAt: new Date() },
    ];
    setNotifications(fakeOrders);
    setIsNotificationModalVisible(true);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalVisible(false);
    setNotifications([]); // Xóa thông báo sau khi đóng modal
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
            <TouchableOpacity onPress={handleOpenNotificationModal}>
              <Ionicons style={{ marginRight: 10 }} name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <AreaTableScreen />

      {/* Modal Thông Báo */}
      <WaiterNotificationModal 
        isVisible={isNotificationModalVisible}
        onClose={handleCloseNotificationModal}
        notifications={notifications}
      />
    </View>
  );
};

export default WaiterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
