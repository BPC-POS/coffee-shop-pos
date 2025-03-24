import React, { useState, useMemo, useEffect } from 'react'; 
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import POSArea from '@/components/pos/PosArea';
import PosProduct from '@/components/pos/PosProduct';
import PosOrderSummary from '@/components/pos/PosOrderSummary';
import { OrderItemAPI, OrderAPI, OrderStatusAPI, PaymentMethod } from '@/types/Order';
import { Table, TableStatus, TableArea } from "@/types/Table";
import Ionicons from '@expo/vector-icons/Ionicons';
import NotificationModal from '@/components/pos/Modal/NotificationModal';

interface Props {
    onTableSelect: (table: Table | null) => void;
}

const PosScreen = () => {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItemAPI[]>([]);
    const [showPosArea, setShowPosArea] = useState(true);
    const [requireTableModalVisible, setRequireTableModalVisible] = useState(false);
    const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
    const [updatedTables, setUpdatedTables] = useState<Table[]>([]);

    useEffect(() => {
    }, [orderItems]);

    const handleTableSelect = (table: Table | null) => {
        setSelectedTable(table);
        setShowPosArea(false);
    };

    const handleOpenRequireTableModal = () => {
        setRequireTableModalVisible(true);
        setShowPosArea(false);
    };

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        setOrderItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            );
            return updatedItems;
        });
    };

    const handleRemoveItem = (productId: number) => {
        setOrderItems(prevItems => {
            const filteredItems = prevItems.filter(item => item.product_id !== productId);
            return filteredItems;
        });
    };

    const handleAddItem = (item: OrderItemAPI) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(exItem => exItem.product_id === item.product_id && exItem.variant_id === item.variant_id); // Check variant_id
            if (existingItem) {
                const updatedItems = prevItems.map(exItem =>
                    exItem.product_id === item.product_id && exItem.variant_id === item.variant_id ? { ...exItem, quantity: exItem.quantity + 1 } : exItem // Check variant_id
                );
                return updatedItems;
            } else {
                const newOrderItem: OrderItemAPI = {
                    ...item, 
                    quantity: 1, 
                };
                const updatedItems = [...prevItems, newOrderItem];
                return updatedItems;
            }
        });
    };


    const calculateOrder = useMemo(() => {
        if (!orderItems || orderItems.length === 0) {
            return null;
        }
        const total_amount = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

        const order: OrderAPI = {
            id: 1, // Lưu ý: Order ID nên được generate ở backend
            items: orderItems,
            status: OrderStatusAPI.CONFIRMED,
            total_amount,
            order_date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user_id: 1, // Lưu ý: User ID nên lấy từ thông tin user đăng nhập
            discount: 0,
            tax: 0,
            payment_info: '',
            shipping_address: '',
            meta: {
                table_id: selectedTable?.id ?? 0,
                payment_method: undefined,
            }
        };
        return order
    }, [orderItems, selectedTable]);


    const handlePaymentComplete = (method: 'cash' | 'transfer') => {
        const order = calculateOrder;
        if (order) {
            const updatedOrder: OrderAPI = {
                ...order,
                payment_info: method === 'cash' ? PaymentMethod.CASH : PaymentMethod.TRANSFER,
            };
        }
        setOrderItems([]);
        if (method === 'cash') {
            setSelectedTable(null);
            setShowPosArea(true);
        }
    }

    const handleCheckout = () => {
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
                            <Ionicons style={{ marginRight: 10 }} name="notifications-outline" size={24} color="white" />
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
                            orderItems={orderItems} // Truyền trực tiếp orderItems state
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
                            selectedTableId={selectedTable?.id || null}
                            orderItems={orderItems} // Truyền trực tiếp orderItems state
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onCheckoutOrder={handleCheckout}
                            onCancelOrder={handleCancelOrder}
                            onPaymentComplete={handlePaymentComplete}
                            onUpdateTableStatus={() => { }}
                            userId={1}
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