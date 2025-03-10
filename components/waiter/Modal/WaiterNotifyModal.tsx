import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Table, TableStatus } from '@/types/Table';
import { Order } from '@/types/Order';

interface NotificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  notifications?: Order[];
}

const WaiterNotificationModal: React.FC<NotificationModalProps> = ({ isVisible, onClose, notifications = [] }) => {
  
  const getNotificationMessage = (order: Order): string => {
    return `Đơn ${order.orderNumber} tại bàn ${order.tableId || 'chưa xác định'} đang ở trạng thái: ${order.status}.`;
  };
  
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
              <Text style={styles.modalTitle}>Thông báo</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.notificationsContainer}>
              {notifications.length > 0 ? (
                notifications.map((order: Order, index: number) => (
                  <View key={index} style={styles.notificationItem}>
                    <Text>{getNotificationMessage(order)}</Text>
                  </View>
                ))
              ) : (
                <Text>Không có thông báo mới.</Text>
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
      width: '80%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      width: '100%',
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
  });
  

export default WaiterNotificationModal;