import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { PaymentMethod, Order as OrderType, OrderAPI, OrderItemAPI, OrderStatusAPI } from '@/types/Order';
import { TableStatus } from '@/types/Table';
import Ionicons from '@expo/vector-icons/Ionicons';
import PaymentMethodModal from './Modal/PaymentModal';
import InvoicePDFModal from './Modal/InvoicePDFModal';
import { createOrder } from '@/api/order';
import { getPaymentInvoicePDF } from '@/api/payment';

interface Props {
    selectedTable: string | null;
    orderItems: OrderItemAPI[];
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onCheckoutOrder: (paymentMethod: 'cash' | 'transfer', taxAmount: number, shippingAddress: string) => void;
    onCancelOrder: () => void;
    onPaymentComplete: (method: 'cash' | 'transfer') => void;
    onUpdateTableStatus: (tableId: number, status: TableStatus) => void;
    selectedTableId: number | null;
    userId: number;
}

const PosOrderSummary: React.FC<Props> = ({
    selectedTable,
    orderItems,
    onUpdateQuantity,
    onRemoveItem,
    onCheckoutOrder,
    onCancelOrder,
    onPaymentComplete,
    onUpdateTableStatus,
    selectedTableId,
    userId
}) => {
    const [voucherCode, setVoucherCode] = useState<string>('');
    const [discountCode, setDiscountCode] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [displayTotalAmount, setDisplayTotalAmount] = useState<number>(0);
    const [tableNumber, setTableNumber] = useState<string | null>(null);
    const [paymentMethodModalVisible, setPaymentMethodModalVisible] = useState(false);
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [qrCodeImage, setQrCodeImage] = useState<Blob | null>(null);
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [taxAmount, setTaxAmount] = useState<number>(0);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [shippingAddress, setShippingAddress] = useState<string>('');
    const [paymentMenuVisible, setPaymentMenuVisible] = useState(false);

    useEffect(() => {
        const total = orderItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
        setTotalAmount(total);
        setDisplayTotalAmount(calculatePriceWithTax(total));
        if (selectedTable) {
            const parts = selectedTable.split('-');
            setTableNumber(parts[parts.length - 1]);
        } else {
            setTableNumber(null);
        }
    }, [orderItems, selectedTable, taxAmount, discountAmount]);


    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            onRemoveItem(productId);
        } else {
            onUpdateQuantity(productId, newQuantity);
        }
    };

    const handlePaymentMethodSelectInModal = async (method: 'cash' | 'transfer') => {
        setPaymentMethodModalVisible(false);

        const { orderCreated, orderId } = await handleCheckoutPress(method as PaymentMethod);

        if (orderCreated) {
            if (method === 'transfer') {
                if (orderId) {
                    setCreatedOrderId(orderId);
                    setPaymentError(null);
                    setPdfModalVisible(true);
                } else {
                    setPaymentError("Lỗi: Không có Order ID sau khi tạo order.");
                    Alert.alert("Lỗi thanh toán", "Không thể tạo mã QR vì Order ID không hợp lệ.");
                    setPaymentMethodModalVisible(true);
                }
            } else if (method === 'cash') {
                onPaymentComplete(method);
            }
        } else {
            Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
            setPaymentMethodModalVisible(true);
        }
    }

    const handleClosePaymentModal = () => {
        setPaymentMethodModalVisible(false);
        setPdfModalVisible(false);
        setPaymentError(null);
        setQrCodeImage(null);
    }

    const handleCheckoutPress = async (paymentMethod: PaymentMethod) => {
        if (orderItems.length === 0) {
            Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm vào đơn hàng trước khi thanh toán.");
            return { orderCreated: false, orderId: null };
        }

        setCreatingOrder(true);
        setPaymentError(null);
        try {
            const orderItemsAPI: OrderItemAPI[] = orderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                variant_id: item.variant_id,
            }));

            const orderData: OrderAPI = {
                user_id: userId,
                order_date: new Date(),
                total_amount: calculatePriceWithTax(totalAmount),
                discount: discountAmount,
                tax: taxAmount,
                status: OrderStatusAPI.CONFIRMED,
                payment_info: paymentMethod,
                shipping_address: shippingAddress,
                items: orderItemsAPI,
                meta: {
                    table_id: selectedTableId || 0,
                    payment_method: paymentMethod === PaymentMethod.CASH ? 1 : 2
                },
            };

            const response = await createOrder(orderData);
            if (response.status >= 200 && response.status < 300) {
                const orderResponseData = response.data;
                const orderId = orderResponseData?.id;
                setCreatedOrderId(orderId || null);
                onUpdateTableStatus(selectedTableId as number, TableStatus.OCCUPIED);
                return { orderCreated: true, orderId };
            } else {
                setPaymentError(`Lỗi khi tạo đơn hàng. Mã lỗi: ${response.status}`);
                Alert.alert("Lỗi tạo đơn hàng", `Không thể tạo đơn hàng. Mã lỗi: ${response.status}`);
                return { orderCreated: false, orderId: null };
            }
        } catch (error: any) {
            setPaymentError("Lỗi kết nối hoặc lỗi không xác định khi tạo đơn hàng.");
            console.error("Error creating order:", error);
            Alert.alert("Lỗi tạo đơn hàng", "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
            return { orderCreated: false, orderId: null };
        } finally {
            setCreatingOrder(false);
        }
    };

    const handleShowPaymentOptions = () => {
        setPaymentMethodModalVisible(true);
    };

    const QuantityControl = ({ productId, quantity }: { productId: number, quantity: number }) => {
        return (
            <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(productId, quantity - 1)}>
                    <Ionicons name="remove-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(productId, quantity + 1)}>
                    <Ionicons name="add-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderOrderItem = ({ item }: { item: OrderItemAPI }) => {
        return (
            <View style={styles.orderItemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={styles.orderItemName}>{item.product_name}</Text>
                </View>
                <View style={styles.orderItemDetails}>
                    <QuantityControl productId={item.product_id} quantity={item.quantity} />
                    <Text style={styles.orderItemPrice}>
                        {item.unit_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Text>
                    <TouchableOpacity onPress={() => onRemoveItem(item.product_id)}>
                        <Text style={styles.removeButton}>Xoá</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    const calculateDiscountedPrice = (currentTotalAmount: number) => {
        let discountedTotal = currentTotalAmount;
        if (discountCode === 'GIAM10') {
            discountedTotal = currentTotalAmount - (currentTotalAmount * 0.1);
        } else if (discountAmount > 0) {
            discountedTotal = currentTotalAmount - discountAmount;
        }
        return Math.max(0, discountedTotal);
    };

    const calculatePriceWithTax = (currentTotalAmount: number) => {
        const discountedPrice = calculateDiscountedPrice(currentTotalAmount);
        return discountedPrice + taxAmount;
    };


    const hidePaymentMenu = () => {
        setPaymentMenuVisible(false);
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Thông tin đơn hàng</Text>
                {selectedTable && <Text style={styles.tableInfo}>Bàn: {tableNumber}</Text>}
                <FlatList
                    data={orderItems}
                    renderItem={renderOrderItem}
                    keyExtractor={item => String(item.product_id)}
                    style={styles.orderItemList}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<Text style={styles.listHeader}>Danh sách món:</Text>}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã giảm giá"
                        value={voucherCode}
                        onChangeText={setVoucherCode}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Giá trị giảm (VNĐ)"
                        keyboardType="number-pad"
                        value={discountAmount.toString()}
                        onChangeText={(text) => setDiscountAmount(Number(text) || 0)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Thuế (VNĐ)"
                        keyboardType="number-pad"
                        value={taxAmount.toString()}
                        onChangeText={(text) => setTaxAmount(Number(text) || 0)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Địa chỉ giao hàng (nếu có)"
                        multiline
                        numberOfLines={2}
                        value={shippingAddress}
                        onChangeText={setShippingAddress}
                    />
                </View>

                <View style={styles.priceSummaryContainer}>
                    <View style={styles.priceLine}>
                        <Text style={styles.priceLabel}>Tổng tiền:</Text>
                        <Text style={styles.priceValue}>{totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                    </View>
                    <View style={styles.priceLine}>
                        <Text style={styles.priceLabel}>Sau giảm giá:</Text>
                        <Text style={styles.discountedPriceValue}>{calculateDiscountedPrice(totalAmount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                    </View>
                    <View style={styles.priceLine}>
                        <Text style={styles.priceLabel}>Tổng tiền sau thuế:</Text>
                        <Text style={styles.finalPriceValue}>{calculatePriceWithTax(totalAmount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.paymentButton}
                        onPress={handleShowPaymentOptions}
                        disabled={creatingOrder}
                    >
                        {creatingOrder ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.paymentButtonText}>Thanh toán</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancelOrder}>
                        <Text style={styles.cancelButtonText}>Hủy đơn</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <PaymentMethodModal
                isVisible={paymentMethodModalVisible}
                totalAmount={calculatePriceWithTax(totalAmount)}
                onPaymentMethodSelect={handlePaymentMethodSelectInModal}
                onClose={handleClosePaymentModal}
                paymentError={paymentError}
            />

            <InvoicePDFModal
                isVisible={pdfModalVisible}
                orderId={createdOrderId}
                onClose={handleClosePaymentModal}
                paymentError={paymentError}
                totalAmount={calculatePriceWithTax(totalAmount)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    tableInfo: {
        fontSize: 18,
        marginBottom: 15,
        color: '#555',
        textAlign: 'center',
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    orderItemList: {
        maxHeight: 150,
        marginBottom: 15,
    },
    orderItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
        marginHorizontal: 10,
        color: '#333',
    },
    removeButton: {
        fontSize: 16,
        color: '#e74c3c',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        fontSize: 16,
        color: '#333',
    },
    priceSummaryContainer: {
        marginBottom: 20,
    },
    priceLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    priceValue: {
        fontSize: 18,
        color: '#3498db',
        fontWeight: 'bold',
    },
    discountedPriceValue: {
        fontSize: 18,
        color: '#27ae60',
        fontWeight: 'bold',
    },
    finalPriceValue: {
        fontSize: 20,
        color: '#8e44ad',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    paymentButton: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: 8,
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
        color: '#333'
    },
});

export default PosOrderSummary;