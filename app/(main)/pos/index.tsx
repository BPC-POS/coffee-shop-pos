import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import POSArea from '@/components/pos/PosArea';
import PosProduct from '@/components/pos/PosProduct';
import PosOrderSummary from '@/components/pos/PosOrderSummary';
import { OrderItem } from '@/types/Order'; 

const PosScreen = () => {
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const handleTableSelect = (tableId: string | null) => {
        setSelectedTable(tableId);
    };
    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    const handleRemoveItem = (productId: string) => {
        setOrderItems(prevItems => prevItems.filter(item => item.productId !== productId))
    }
    const handleAddItem = (item : OrderItem) => {
      setOrderItems(prevItems => {
        const existingItem = prevItems.find(exItem => exItem.productId === item.productId);
        if (existingItem) {
          return prevItems.map(exItem =>
              exItem.productId === item.productId ? { ...exItem, quantity: exItem.quantity + 1 } : exItem
          );
        } else {
          return [...prevItems, item]
        }

      })

    }

    const handleCheckout = () => {
        // logic thanh toán
        console.log(orderItems)
        setOrderItems([]); // Clear giỏ hàng sau khi thanh toán
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
                  selectedTable={selectedTable}
                  orderItems={orderItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                  onAddItem={handleAddItem}
                />
                <PosOrderSummary
                selectedTable={selectedTable}
                orderItems={orderItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
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