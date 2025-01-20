import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import POSArea from '@/components/pos/PosArea';
import PosProduct from '@/components/pos/PosProduct';
import PosOrderSummary from '@/components/pos/PosOrderSummary';
import { OrderItem, Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/Order';
import { Table } from '@/types/Table';

interface Props {
    onTableSelect: (table: Table | null) => void;
}

const PosScreen = () => {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [requireTableModalVisible, setRequireTableModalVisible] = useState(false);

    const handleTableSelect = (table: Table | null) => {
        console.log("PosScreen - handleTableSelect - table:", table);
        setSelectedTable(table);
    };
     const handleOpenRequireTableModal = () => {
        setRequireTableModalVisible(true)
     }

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

    // PosScreen.tsx
    const handleAddItem = (item: any) => {
      setOrderItems(prevItems => {
        const existingItem = prevItems.find(exItem => exItem.productId === item.productId);
        if (existingItem) {
          return prevItems.map(exItem =>
            exItem.productId === item.productId ? { ...exItem, quantity: exItem.quantity + 1 } : exItem
          );
        } else {
           const newOrderItem : OrderItem = {
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
        if(!orderItems || orderItems.length === 0) {
            return null;
        }
       const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order : Order = {
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
        console.log("PosScreen - handlePaymentComplete - payment method:", method);
        // Xử lý thanh toán ở đây
       const order = calculateOrder
       if(order){
            const updatedOrder: Order = {
              ...order,
                paymentStatus: PaymentStatus.PAID,
              paymentMethod: method === 'cash' ? PaymentMethod.CASH : PaymentMethod.TRANSFER,
           }
           console.log(updatedOrder)
       }


        setOrderItems([]);
        if(method === 'cash') {
            setSelectedTable(null);
        }


    }
    const handleCheckout = () => {
        console.log(orderItems)
       
    }

    const handleCancelOrder = () => {
        setOrderItems([]);
        setSelectedTable(null);
    }
    
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
                }}
            />
           <View style={styles.areaContainer}>
               <POSArea onTableSelect={handleTableSelect} />
           </View>
           <View style={styles.productContainer}>
                <PosProduct
                  selectedTable={selectedTable?.id ? String(selectedTable?.id): null}
                  orderItems={orderItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                  onAddItem={handleAddItem}
                     onOpenRequireTableModal={handleOpenRequireTableModal}
                />
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    areaContainer: {
        flex: 1,
    },
   productContainer: {
     flex: 2,
   },
});

export default PosScreen;