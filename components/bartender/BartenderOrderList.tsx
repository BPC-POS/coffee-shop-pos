import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '@/types/Order';
import { formatDateTime } from '@/utils/datetime';

interface Props {
    orders: Order[];
    onViewRecipe: (productId: number) => void;
    onStartPrepare: (order: Order) => void;
    onCompletePrepare: (order: Order) => void;
}
const BartenderOrderList = ({ orders, onViewRecipe, onStartPrepare, onCompletePrepare }: Props) => {
    return (
        <View style={styles.container}>
            {orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                        <Text style={styles.orderNumber}>Đơn #{order.orderNumber}</Text>
                        <Text style={styles.orderTime}>
                            {formatDateTime(order.createdAt)}
                        </Text>
                    </View>
                    <Text style={styles.tableName}>Bàn: {order.tableId}</Text>
                    
                    {order.items.map((item) => (
                        <View key={item.id} style={styles.itemContainer}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.productName}</Text>
                                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.recipeButton}
                                onPress={() => onViewRecipe(item.productId)}
                            >
                                <Text style={styles.recipeButtonText}>Xem công thức</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    
                    <View style={styles.orderFooter}>
                        <Text style={styles.totalAmount}>
                            Tổng tiền: {order.totalAmount?.toLocaleString()}đ
                        </Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity 
                                style={[styles.button, styles.startButton]}
                                onPress={() => onStartPrepare(order)}
                            >
                                <Text style={styles.buttonText}>Bắt đầu pha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.button, styles.completeButton]}
                                onPress={() => onCompletePrepare(order)}
                            >
                                <Text style={styles.buttonText}>Hoàn thành</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderTime: {
        fontSize: 14,
        color: '#666',
    },
    tableName: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 16,
        flex: 1,
    },
    itemQuantity: {
        fontSize: 16,
        marginLeft: 10,
        color: '#666',
    },
    recipeButton: {
        backgroundColor: '#8b4513',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    recipeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    orderFooter: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    startButton: {
        backgroundColor: '#28a745',
    },
    completeButton: {
        backgroundColor: '#007bff',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default BartenderOrderList; 
