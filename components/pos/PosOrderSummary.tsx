import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { OrderItem } from '@/types/Order';
import { Order } from '@/types/Order';
import { Ionicons } from '@expo/vector-icons'; 
import PaymentModal from './PaymentModal';

interface Props {
    selectedTable: string | null;
    orderItems: OrderItem[];
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
    onCancelOrder: () => void;
    onPaymentComplete: (method: 'cash' | 'transfer') => void;
}

const PosOrderSummary: React.FC<Props> = ({
    selectedTable,
    orderItems,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    onCancelOrder,
    onPaymentComplete
}) => {
    const [discountCode, setDiscountCode] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [tableNumber, setTableNumber] = useState<string | null>(null);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);


    useEffect(() => {
        const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalAmount(total);
        if (selectedTable) {
            const parts = selectedTable.split('-');
            setTableNumber(parts[parts.length - 1]);
        } else {
            setTableNumber(null);
        }
    }, [orderItems, selectedTable]);


   const handleQuantityChange = (productId: number, newQuantity: number) => {
    console.log(orderItems);
        if (newQuantity <= 0) {
            onRemoveItem(productId);
        } else {
            onUpdateQuantity(productId, newQuantity);
        }
    };
   const handlePaymentMethodSelect = (method: 'cash' | 'transfer') => {
        setPaymentModalVisible(false);
        onPaymentComplete(method)
   }
   const handleClosePaymentModal = () => {
       setPaymentModalVisible(false);
   }
   const handleCheckoutPress = () => {
        setPaymentModalVisible(true);
    }

   const QuantityControl = ({ productId, quantity }: { productId: number, quantity: number }) => {
        return (
            <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(productId, quantity - 1)}>
                      <Ionicons name="remove-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton}  onPress={() => handleQuantityChange(productId, quantity + 1)}>
                     <Ionicons name="add-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>
        );
    };
    const renderOrderItem = ({ item }: { item: OrderItem }) => {
        return (
            <View style={styles.orderItemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={styles.orderItemName}>{item.productName}</Text>
                </View>
                <View style={styles.orderItemDetails}>
                    <QuantityControl productId={item.productId} quantity={item.quantity} />
                    <Text style={styles.orderItemPrice}>
                        {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Text>
                    <TouchableOpacity onPress={() => onRemoveItem(item.productId)}>
                        <Text style={styles.removeButton}>Xoá</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    const calculateDiscountedTotal = () => {
        let discountedTotal = totalAmount;
        if (discountCode === 'GIAM10') {
            discountedTotal = totalAmount * 0.9;
        }
        return discountedTotal;
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin đơn hàng</Text>
            {selectedTable && <Text style={styles.tableInfo}>Bàn: {tableNumber}</Text>}
            <FlatList
                data={orderItems}
                renderItem={renderOrderItem}
                keyExtractor={item => String(item.productId)}
                style={{ maxHeight: 250 }}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.discountContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChangeText={setDiscountCode}
                />
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng cộng:</Text>
                <Text style={styles.totalAmount}>
                    {calculateDiscountedTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.checkoutButton, { flex: 1, marginRight: 5 }]} onPress={handleCheckoutPress}>
                    <Text style={styles.checkoutButtonText}>Thanh toán</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cancelButton, { flex: 1 }]} onPress={onCancelOrder}>
                    <Text style={styles.cancelButtonText}>Hủy đơn</Text>
                </TouchableOpacity>
            </View>
                <PaymentModal
                    isVisible={paymentModalVisible}
                    totalAmount={calculateDiscountedTotal()}
                    onPaymentMethodSelect={handlePaymentMethodSelect}
                     onClose={handleClosePaymentModal}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tableInfo: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    orderItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    orderItemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderItemName: {
        fontSize: 16,
        flex: 1,
        color: '#333',
    },
    orderItemPrice: {
        fontSize: 16,
        marginRight: 5,
        marginLeft: 5,
        color: '#333',
    },
    removeButton: {
        fontSize: 16,
        color: 'red',
    },
    discountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 18,
        color: '#28a745',
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
      quantityButton: {
    padding: 5,
  },
    quantityText: {
      fontSize: 18,
      marginHorizontal: 5,
      color: '#333'
    },
});

export default PosOrderSummary;