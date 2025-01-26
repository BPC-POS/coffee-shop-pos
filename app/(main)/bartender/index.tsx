import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Order, OrderStatus } from '@/types/Order';
import { mockOrders } from '@/mock/mockdata';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';
import BartenderRecipeModal from '@/components/bartender/BartenderRecipeModal';
import BartenderCompleteModal from '@/components/bartender/BartenderCompleteModal';
import { useRouter } from 'expo-router';

const BartenderScreen = () => {
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const [completeModalVisible, setCompleteModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    // Lọc các đơn hàng cần pha chế (status PENDING)
    const pendingOrders = useMemo(() => {
        return mockOrders.filter(order => order.status === OrderStatus.PENDING);
    }, [mockOrders]);

    const handleViewRecipe = (productId: number) => {
        setSelectedProductId(productId);
        setRecipeModalVisible(true);
    };

    const handleStartPrepare = (order: Order) => {
        order.status = OrderStatus.PREPARING;
        router.push('/(main)/bartender/preparing');
    };

    const handleCompletePrepare = (order: Order) => {
        setSelectedOrder(order);
        setCompleteModalVisible(true);
    };

    const handleCancelOrder = (order: Order) => {
        order.status = OrderStatus.CANCELLED;
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Pha chế',
                    headerStyle: {
                        backgroundColor: '#8b4513', // Màu nâu coffee
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <ScrollView style={styles.content}>
                <BartenderOrderList
                    orders={pendingOrders}
                    onViewRecipe={handleViewRecipe}
                    onStartPrepare={handleStartPrepare}
                    onCompletePrepare={handleCompletePrepare}
                    onCancelOrder={handleCancelOrder}
                />
            </ScrollView>

            <BartenderRecipeModal
                visible={recipeModalVisible}
                productId={selectedProductId}
                onClose={() => setRecipeModalVisible(false)}
            />

            <BartenderCompleteModal
                visible={completeModalVisible}
                order={selectedOrder}
                onConfirm={() => {
                    if (selectedOrder) {
                        selectedOrder.status = OrderStatus.COMPLETED;
                        router.push('/(main)/bartender/completed');
                    }
                    setCompleteModalVisible(false);
                    setSelectedOrder(null);
                }}
                onClose={() => setCompleteModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});

export default BartenderScreen;
