import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { formatCurrency } from '@/utils/format';
interface Props {
    isVisible: boolean;
    totalAmount: number;
    onPaymentMethodSelect: (method: 'cash' | 'transfer') => void;
    onClose: () => void;
}

const PaymentModal: React.FC<Props> = ({ isVisible, totalAmount, onPaymentMethodSelect, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Tổng tiền: {formatCurrency(totalAmount)}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.paymentButton, { marginRight: 10 }]}
                            onPress={() => onPaymentMethodSelect('cash')}
                        >
                            <Text style={styles.paymentButtonText}>Tiền mặt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.paymentButton}
                            onPress={() => onPaymentMethodSelect('transfer')}
                        >
                            <Text style={styles.paymentButtonText}>Chuyển khoản</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
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
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
         fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    paymentButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
      flex: 1,
    },
    paymentButtonText: {
        color: 'white',
        textAlign: 'center',
         fontWeight: 'bold'
    },
    closeButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default PaymentModal;