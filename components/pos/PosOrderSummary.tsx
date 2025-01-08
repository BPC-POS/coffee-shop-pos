import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { OrderItem } from '@/types/Order'; // Đảm bảo import đúng đường dẫn
import NumericInput from 'react-native-numeric-input';
interface Props {
  selectedTable: string | null;
  orderItems: OrderItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const PosOrderSummary: React.FC<Props> = ({ selectedTable, orderItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [discountCode, setDiscountCode] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [orderItems]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(productId);
    } else {
      onUpdateQuantity(productId, newQuantity);
    }
  };
    const renderOrderItem = ({ item }: { item: OrderItem }) => (
        <View style={styles.orderItemContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Text style={styles.orderItemName}>{item.name}</Text>
          </View>
            <View style={styles.orderItemDetails}>
              <NumericInput
                value={item.quantity}
                onChange={value => handleQuantityChange(item.productId, value)}
                minValue={0}
                 maxValue={99}
                totalWidth={100}
                totalHeight={30}
                iconSize={20}
                step={1}
                  rounded
                textColor='#333'
                // iconStyle={{ color: '#333' }}
              />
              <Text style={styles.orderItemPrice}>
                {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </Text>
                <TouchableOpacity
                    onPress={() => onRemoveItem(item.productId)}
                >
                    <Text style={styles.removeButton}>Xoá</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  const calculateDiscountedTotal = () => {
    let discountedTotal = totalAmount;
    if (discountCode === "GIAM10") {
      discountedTotal = totalAmount * 0.9;
    }
    return discountedTotal;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin đơn hàng</Text>
      {selectedTable && <Text style={styles.tableInfo}>Bàn: {selectedTable}</Text>}
      <FlatList
        data={orderItems}
        renderItem={renderOrderItem}
        keyExtractor={item => item.productId}
        style={{maxHeight: 250}}
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
      <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
          <Text style={styles.checkoutButtonText}>Thanh toán</Text>
      </TouchableOpacity>
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
        color: '#555'
    },
  orderItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 5,
        borderBottomWidth: 1,
      borderBottomColor: '#ccc'
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
      marginBottom: 10
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
      marginTop: 10,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PosOrderSummary;