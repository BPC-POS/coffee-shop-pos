import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Order, OrderStatus } from '@/types/Order';
import { mockOrders } from '@/mock/mockdata';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';
import BartenderRecipeModal from '@/components/bartender/BartenderRecipeModal';
import BartenderCompleteModal from '@/components/bartender/BartenderCompleteModal';
import BartenderNotificationModal from '@/components/bartender/BartenderNotificationModal';

const BartenderScreen = () => {
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const [completeModalVisible, setCompleteModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [prevOrderCount, setPrevOrderCount] = useState(mockOrders.length);
    const [hasNewOrder, setHasNewOrder] = useState(false);

    // Lọc đơn hàng PENDING
    const pendingOrders = useMemo(() => {
        return mockOrders.filter(order => order.status === OrderStatus.PENDING);
    }, [mockOrders]);

    useEffect(() => {
        if (pendingOrders.length > prevOrderCount) {
            Alert.alert('Thông báo', 'Có đơn hàng mới cần pha chế!', [{ text: 'OK' }]);
            setHasNewOrder(true);
        }
        setPrevOrderCount(pendingOrders.length);
    }, [pendingOrders]);

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
                    headerStyle: { backgroundColor: '#8b4513' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => {
                            setIsNotificationVisible(true);
                            setHasNewOrder(false);
                        }}>
                            <Ionicons 
                                name={hasNewOrder ? 'notifications' : 'notifications-outline'} 
                                size={24} 
                                color="white" 
                                style={{ marginRight: 10 }} 
                            />
                        </TouchableOpacity>
                    ),
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

            <BartenderNotificationModal
                isVisible={isNotificationVisible}
                onClose={() => setIsNotificationVisible(false)}
                notifications={pendingOrders}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { flex: 1 },
});

export default BartenderScreen;
