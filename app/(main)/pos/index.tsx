import React, { useState, useMemo, useEffect } from 'react'; 
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import POSArea from '@/components/pos/PosArea';
import PosProduct from '@/components/pos/PosProduct';
import PosOrderSummary from '@/components/pos/PosOrderSummary';
import { OrderItemAPI, OrderAPI, OrderStatusAPI, PaymentMethod } from '@/types/Order';
import { Table, TableStatus, TableArea, tableStatusToNumericStatus } from "@/types/Table";
import Ionicons from '@expo/vector-icons/Ionicons';
import NotificationModal from '@/components/pos/Modal/NotificationModal';
import { tableApi, updateTable } from '@/api/table';
import { getTables } from '@/api/table';

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
    const [tables, setTables] = useState<Table[]>([]);

    useEffect(() => {
        fetchTables();
        
        // Thiết lập interval để cập nhật danh sách bàn mỗi 30 giây
        const interval = setInterval(fetchTables, 30000);
        
        // Clear interval khi component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchTables = async () => {
        try {
            const response = await getTables();
            setTables(response.data);
        } catch (error) {
            console.error("Error fetching tables:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách bàn");
        }
    };

    const handleTableSelect = async (table: Table | null) => {
        setSelectedTable(table);
        setShowPosArea(false);
        
        // Cập nhật trạng thái bàn thành "Có khách" (OCCUPIED) khi chọn bàn
        if (table && table.status !== tableStatusToNumericStatus[TableStatus.OCCUPIED]) {
            try {
                await updateTable({
                    id: table.id,
                    name: table.name,
                    capacity: table.capacity,
                    notes: table.note || '',
                    status: tableStatusToNumericStatus[TableStatus.OCCUPIED], // Chuyển trạng thái thành "Có khách"
                    areaId: table.areaId
                });
                
                // Thông báo cho người dùng biết rằng trạng thái bàn đã được cập nhật
                console.log(`Đã cập nhật bàn ${table.name} sang trạng thái "Có khách"`);
                
                // Cập nhật lại selectedTable với trạng thái mới
                setSelectedTable({
                    ...table,
                    status: tableStatusToNumericStatus[TableStatus.OCCUPIED]
                });
                
                // Cập nhật danh sách bàn
                fetchTables();
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái bàn:", error);
                Alert.alert("Lỗi", "Không thể cập nhật trạng thái bàn.");
            }
        }
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


    const handlePaymentComplete = async (method: 'cash' | 'transfer') => {
        const order = calculateOrder;
        if (order) {
            const updatedOrder: OrderAPI = {
                ...order,
                payment_info: method === 'cash' ? PaymentMethod.CASH : PaymentMethod.TRANSFER,
            };
            // TODO: Gọi API để lưu đơn hàng
        }
        
        // Nếu thanh toán bằng tiền mặt, cập nhật trạng thái bàn thành "Cần dọn dẹp"
        if (method === 'cash' && selectedTable) {
            try {
                await updateTable({
                    id: selectedTable.id,
                    name: selectedTable.name,
                    capacity: selectedTable.capacity,
                    notes: selectedTable.note || '',
                    status: tableStatusToNumericStatus[TableStatus.CLEANING], // Chuyển trạng thái thành "Cần dọn dẹp"
                    areaId: selectedTable.areaId
                });
                console.log(`Đã cập nhật bàn ${selectedTable.name} sang trạng thái "Cần dọn dẹp"`);
                
                // Cập nhật danh sách bàn
                fetchTables();
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái bàn:", error);
                Alert.alert("Lỗi", "Không thể cập nhật trạng thái bàn.");
            }
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
            { id: 101, name: 'Bàn 101', capacity: 4, status: TableStatus.AVAILABLE, areaId: 1, area: { code: "vip", id: "1", name: "VIP", isActive: true }, isActive: true, meta: {}, createdAt: new Date(), updatedAt: new Date() },
            { id: 102, name: 'Bàn 102', capacity: 2, status: TableStatus.OCCUPIED, areaId: 1, area: { code: "vip", id: "1", name: "VIP", isActive: true }, isActive: true, meta: {}, createdAt: new Date(), updatedAt: new Date() },
            { id: 103, name: 'Bàn 103', capacity: 6, status: TableStatus.AVAILABLE, areaId: 1, area: { code: "vip", id: "1", name: "VIP", isActive: true }, isActive: true, meta: {}, createdAt: new Date(), updatedAt: new Date() },
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
                    <POSArea onTableSelect={handleTableSelect} tables={tables} />
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
                            onUpdateTableStatus={async (tableId, status) => {
                                try {
                                    // Tìm thông tin đầy đủ của bàn hiện tại
                                    const tableToUpdate = tables.find(t => t.id === tableId);
                                    if (!tableToUpdate) {
                                        throw new Error("Không tìm thấy thông tin bàn");
                                    }
                                    
                                    // Chuẩn bị dữ liệu đầy đủ để cập nhật
                                    await updateTable({
                                        id: tableId,
                                        name: tableToUpdate.name,
                                        capacity: tableToUpdate.capacity,
                                        notes: tableToUpdate.note || "",
                                        status: tableStatusToNumericStatus[status],
                                        areaId: tableToUpdate.areaId
                                    });
                                    
                                    // Cập nhật danh sách bàn
                                    fetchTables();
                                    
                                    console.log(`Đã cập nhật bàn ${tableToUpdate.name} sang trạng thái ${status}`);
                                } catch (error) {
                                    console.error("Lỗi khi cập nhật trạng thái bàn:", error);
                                    Alert.alert("Lỗi", "Không thể cập nhật trạng thái bàn.");
                                }
                            }}
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