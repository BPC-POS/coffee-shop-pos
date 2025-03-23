import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import POSArea from '@/components/pos/PosArea';
import PosProduct from '@/components/pos/PosProduct';
import PosOrderSummary from '@/components/pos/PosOrderSummary';
import { OrderItem, Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/Order';
import { Table, TableStatus, TableArea } from "@/types/Table"; 
import { Ionicons } from '@expo/vector-icons';
import NotificationModal from '@/components/pos/Modal/NotificationModal';

interface Props {
  onTableSelect: (table: Table | null) => void;
}

const PosScreen = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showPosArea, setShowPosArea] = useState(true);
  const [requireTableModalVisible, setRequireTableModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  // State to hold the table notifications
  const [updatedTables, setUpdatedTables] = useState<Table[]>([]);

  const handleTableSelect = (table: Table | null) => {
    setSelectedTable(table);
    setShowPosArea(false);
  };
  const handleOpenRequireTableModal = () => {
    setRequireTableModalVisible(true)
    setShowPosArea(false);
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setOrderItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const handleAddItem = (item: any) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(exItem => exItem.productId === item.productId);
      if (existingItem) {
        return prevItems.map(exItem =>
          exItem.productId === item.productId ? { ...exItem, quantity: exItem.quantity + 1 } : exItem
        );
      } else {
        const newOrderItem: OrderItem = {
          id: Date.now(),
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: 1,
          note: ''
        }
        return [...prevItems, newOrderItem];

      }
    });
  };


  const calculateOrder = useMemo(() => {
    if (!orderItems || orderItems.length === 0) {
      return null;
    }
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order: Order = {
      id: 1,
      orderNumber: `OD-${Date.now()}`,
      customerName: 'Khách hàng',
      tableId: selectedTable?.id,
      items: orderItems,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return order
  }, [orderItems, selectedTable]);


  const handlePaymentComplete = (method: 'cash' | 'transfer') => {
    const order = calculateOrder
    if (order) {
      const updatedOrder: Order = {
        ...order,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: method === 'cash' ? PaymentMethod.CASH : PaymentMethod.TRANSFER,
      }
      console.log(updatedOrder)
    }
    setOrderItems([]);
    if (method === 'cash') {
      setSelectedTable(null);
      setShowPosArea(true);
    }
  }

  const handleCheckout = () => {
    console.log(orderItems)
  }

  const handleCancelOrder = () => {
    setOrderItems([]);
    setSelectedTable(null);
    setShowPosArea(true);
  }

  const handleOpenNotificationModal = () => {
    const fakeUpdatedTables: Table[] = [
      { id: 101, name: 'Bàn 101', capacity: 4, status: TableStatus.AVAILABLE, areaId: 1, area: TableArea.VIP, isActive: true, meta: {}, createdAt: new Date(), updatedAt: new Date() },
      { id: 102, name: 'Bàn 102', capacity: 2, status: TableStatus.OCCUPIED, areaId: 1, area: TableArea.VIP, isActive: true, meta: {}, createdAt: new Date(), updatedAt: new Date() },
      { id: 103, name: 'Bàn 103', capacity: 6, status: TableStatus.AVAILABLE, areaId: 1, area: TableArea.VIP, isActive: true, meta: {}, createdAt: new Date(), updatedAt: new Date() },
    ];
    setUpdatedTables(fakeUpdatedTables);
    setIsNotificationModalVisible(true);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalVisible(false);
    setUpdatedTables([]); 
  };


  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Điểm bán hàng',
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => ( 
            <TouchableOpacity onPress={handleOpenNotificationModal}>
                <Ionicons style={{marginRight: 10}} name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      {showPosArea ? (
        <View style={styles.fullScreenAreaContainer}>
          <POSArea onTableSelect={handleTableSelect} />
        </View>
      ) : (
        <View style={styles.productAndSummaryContainer}>
          <View style={styles.productContainer}>
            <PosProduct
              selectedTable={selectedTable?.id ? String(selectedTable?.id) : null}
              orderItems={orderItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
              onAddItem={handleAddItem}
              onOpenRequireTableModal={handleOpenRequireTableModal}
            />
          </View>
          <View style={styles.summaryContainer}>
            <PosOrderSummary
              selectedTable={selectedTable?.name || null}
              orderItems={orderItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
              onCancelOrder={handleCancelOrder}
              onPaymentComplete={handlePaymentComplete}
            />
          </View>
        </View>
      )}

      <NotificationModal
        isVisible={isNotificationModalVisible}
        onClose={handleCloseNotificationModal}
        notifications={updatedTables} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenAreaContainer: {
    flex: 1,
  },
  productAndSummaryContainer: {
    flex: 1,
  },
  productContainer: {
    flex: 3,
  },
  summaryContainer: {
    flex: 2.5,
  },
});

export default PosScreen;