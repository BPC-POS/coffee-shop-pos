import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Order, OrderStatus } from '@/types/Order';
import { mockOrders } from '@/mock/mockdata';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';
import BartenderRecipeModal from '@/components/bartender/BartenderRecipeModal';
import BartenderCompleteModal from '@/components/bartender/BartenderCompleteModal';
import { ScrollView } from 'react-native-gesture-handler';

const BartenderScreen = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const [completeModalVisible, setCompleteModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    // Lọc các đơn hàng cần pha chế (status PENDING)
    const pendingOrders = useMemo(() => {
        return mockOrders.filter(order => order.status === OrderStatus.PENDING);
    }, []);

    const handleViewRecipe = (productId: number) => {
        setSelectedProductId(productId);
        setRecipeModalVisible(true);
    };

    const handleStartPrepare = (order: Order) => {
        setSelectedOrder(order);
        // TODO: Cập nhật trạng thái đơn hàng sang PREPARING
    };

    const handleCompletePrepare = (order: Order) => {
        setSelectedOrder(order);
        setCompleteModalVisible(true);
    };

    const handleConfirmComplete = () => {
        if (selectedOrder) {
            // TODO: Cập nhật trạng thái đơn hàng sang READY
            console.log("Completed order:", selectedOrder.orderNumber);
        }
        setCompleteModalVisible(false);
        setSelectedOrder(null);
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
                onConfirm={handleConfirmComplete}
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
