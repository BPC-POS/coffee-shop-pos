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
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [completeModalVisible, setCompleteModalVisible] = useState(false);
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const preparingOrders = useMemo(() => {
        return mockOrders.filter(order => order.status === OrderStatus.PREPARING);
    }, [mockOrders]);

    const handleViewRecipe = (productId: number) => {
        setSelectedProductId(productId);
        setRecipeModalVisible(true);
    };

    const handleCompletePrepare = (order: Order) => {
        setSelectedOrder(order);
        setCompleteModalVisible(true);
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
                onConfirm={() => {
                    if (selectedOrder) {
                        selectedOrder.status = OrderStatus.COMPLETED;
                        router.push('/(main)/bartender/completed');
                    }
                    setCompleteModalVisible(false);
                    setSelectedOrder(null);
                }}
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