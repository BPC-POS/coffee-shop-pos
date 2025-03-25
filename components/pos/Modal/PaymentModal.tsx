import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { formatCurrency } from '@/utils/format';

export interface Props {
    isVisible: boolean;
    totalAmount: number;
    onPaymentMethodSelect: (method: 'cash' | 'transfer') => Promise<void>;
    onClose: () => void;
    paymentError: string | null; // Có thể không cần prop này ở PaymentMethodModal
}

const PaymentModal: React.FC<Props> = ({ isVisible, totalAmount, onPaymentMethodSelect, onClose, paymentError }) => {
    const [paymentLoading, setPaymentLoading] = React.useState(false);

    const handleMethodSelect = async (method: 'cash' | 'transfer') => {
        setPaymentLoading(true);
        await onPaymentMethodSelect(method); // Gọi callback để xử lý thanh toán ở component cha
        setPaymentLoading(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
                    <Text style={styles.modalText}>Tổng tiền: {formatCurrency(totalAmount)}</Text>

                    {paymentError && ( // Chỉ hiển thị paymentError nếu có (từ prop)
                        <Text style={styles.errorText}>{paymentError}</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.paymentButton, { marginRight: 10 }]}
                            onPress={() => handleMethodSelect('cash')}
                            disabled={paymentLoading}
                        >
                            {paymentLoading ? <ActivityIndicator color="white" /> : <Text style={styles.paymentButtonText}>Tiền mặt</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.paymentButton}
                            onPress={() => handleMethodSelect('transfer')}
                            disabled={paymentLoading}
                        >
                             {paymentLoading ? <ActivityIndicator color="white" /> : <Text style={styles.paymentButtonText}>Chuyển khoản</Text>}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        disabled={paymentLoading}
                    >
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        width: '100%',
    },
    paymentButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    paymentButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#dc3545',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default PaymentModal;