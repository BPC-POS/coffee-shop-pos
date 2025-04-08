import React, { useState, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Table, TableStatus } from '@/types/Table';
import { Order, OrderStatus } from '@/types/Order';

interface NotificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  notifications?: Order[];
  onMarkAsDelivered?: (orderId: number) => void;
}

const WaiterNotificationModal: React.FC<NotificationModalProps> = ({ 
  isVisible, 
  onClose, 
  notifications = [],
  onMarkAsDelivered
}) => {
  const [deliveredOrders, setDeliveredOrders] = useState<number[]>([]);
  
  const handleMarkAsDelivered = (orderId: number, orderNumber: string) => {
    // Hiển thị hộp thoại xác nhận
    Alert.alert(
      "Xác nhận đã giao",
      `Bạn có chắc chắn đã giao đơn hàng #${orderNumber} chưa?`,
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Xác nhận", 
          onPress: () => {
            // Thêm orderId vào danh sách đã giao
            setDeliveredOrders(prev => [...prev, orderId]);
            
            // Gọi callback nếu có
            if (onMarkAsDelivered) {
              onMarkAsDelivered(orderId);
            }
            
            // Hiển thị thông báo thành công
            Alert.alert(
              "Thành công",
              `Đã đánh dấu đơn hàng #${orderNumber} là đã giao`,
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };
  
  const getNotificationMessage = (order: Order): string => {
    const statusText = order.status === OrderStatus.COMPLETED ? 'đã hoàn thành' : order.status;
    const timeString = order.updatedAt.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `Đơn #${order.orderNumber} tại bàn ${order.tableId || 'chưa xác định'} ${statusText} lúc ${timeString}`;
  };
  
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return '#4CAF50'; // Xanh lá
      case OrderStatus.READY:
        return '#2196F3'; // Xanh dương
      case OrderStatus.PREPARING:
        return '#FFC107'; // Vàng
      case OrderStatus.CONFIRMED:
        return '#9C27B0'; // Tím
      case OrderStatus.PENDING:
        return '#FF9800'; // Cam
      case OrderStatus.CANCELLED:
        return '#F44336'; // Đỏ
      default:
        return '#757575'; // Xám
    }
  };
  
  // Lọc các đơn hàng chưa được đánh dấu là đã giao và sắp xếp theo thời gian hoàn thành (mới nhất lên đầu)
  const sortedNotifications = useMemo(() => {
    return notifications
      .filter(order => !deliveredOrders.includes(order.id))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [notifications, deliveredOrders]);
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thông báo đơn hàng</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.notificationsContainer}>
            {sortedNotifications.length > 0 ? (
              sortedNotifications.map((order: Order, index: number) => (
                <View key={index} style={styles.notificationItem}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.orderNumber}>Đơn #{order.orderNumber}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                      <Text style={styles.statusText}>
                        {order.status === OrderStatus.COMPLETED ? 'Hoàn thành' : order.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tableInfo}>Bàn: {order.tableId || 'Chưa xác định'}</Text>
                  <Text style={styles.timeInfo}>
                    Hoàn thành: {order.updatedAt.toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </Text>
                  <Text style={styles.totalAmount}>
                    Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}đ
                  </Text>
                  <TouchableOpacity 
                    style={styles.deliveredButton}
                    onPress={() => handleMarkAsDelivered(order.id, order.orderNumber)}
                  >
                    <MaterialIcons name="check-circle" size={18} color="white" />
                    <Text style={styles.deliveredButtonText}>Đã giao</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="notifications-none" size={50} color="#ccc" />
                <Text style={styles.emptyText}>Không có thông báo mới</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationsContainer: {
    width: '100%',
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  timeInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
  },
  deliveredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  deliveredButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default WaiterNotificationModal;