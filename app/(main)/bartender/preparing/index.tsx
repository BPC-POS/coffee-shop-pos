import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Order, OrderStatus } from '@/types/Order';
import { mockOrders } from '@/mock/mockdata';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';
import BartenderCompleteModal from '@/components/bartender/BartenderCompleteModal';
import BartenderRecipeModal from '@/components/bartender/BartenderRecipeModal';
import { useRouter } from 'expo-router';

export default function PreparingOrdersScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [completeModalVisible, setCompleteModalVisible] = useState(false);
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const preparingOrders = useMemo(() => {
        return orders.filter(order => order.status === OrderStatus.PREPARING);
    }, [orders]);

    const handleViewRecipe = (productId: number) => {
        setSelectedProductId(productId);
        setRecipeModalVisible(true);
    };

    const handleCompletePrepare = (order: Order) => {
        setSelectedOrder(order);
        setCompleteModalVisible(true);
    };

    const handleConfirmComplete = () => {
        if (selectedOrder) {
            // Cập nhật trạng thái đơn hàng
            const updatedOrders = orders.map(o => 
                o.id === selectedOrder.id 
                    ? { ...o, status: OrderStatus.COMPLETED }
                    : o
            );
            setOrders(updatedOrders);
            mockOrders.forEach(o => {
                if (o.id === selectedOrder.id) {
                    o.status = OrderStatus.COMPLETED;
                }
            });
            router.push('/(main)/bartender/completed');
        }
        setCompleteModalVisible(false);
        setSelectedOrder(null);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <BartenderOrderList
                    orders={preparingOrders}
                    onViewRecipe={handleViewRecipe}
                    onCompletePrepare={handleCompletePrepare}
                    showStartButton={false}
                />
            </ScrollView>

            <BartenderCompleteModal
                visible={completeModalVisible}
                order={selectedOrder}
                onConfirm={handleConfirmComplete}
                onClose={() => {
                    setCompleteModalVisible(false);
                    setSelectedOrder(null);
                }}
            />

            <BartenderRecipeModal
                visible={recipeModalVisible}
                productId={selectedProductId}
                onClose={() => setRecipeModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
}); 