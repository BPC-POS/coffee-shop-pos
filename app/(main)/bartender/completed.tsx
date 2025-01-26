import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Order, OrderStatus } from '@/types/Order';
import { mockOrders } from '@/mock/mockdata';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';

export default function CompletedOrdersScreen() {
    const completedOrders = useMemo(() => {
        return mockOrders.filter(order => order.status === OrderStatus.COMPLETED);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <BartenderOrderList
                    orders={completedOrders}
                    onViewRecipe={() => {}}
                    showStartButton={false}
                    showCompleteButton={false}
                    showRecipeButton={false}
                />
            </ScrollView>
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