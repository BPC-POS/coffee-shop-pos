import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '@/types/Order';

interface Props {
    visible: boolean;
    order: Order | null;
    onConfirm: () => void;
    onClose: () => void;
}

const BartenderCompleteModal = ({ visible, order, onConfirm, onClose }: Props) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Xác nhận hoàn thành</Text>
                    <Text>Đơn hàng: {order?.orderNumber}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.buttonText}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    confirmButton: {
        flex: 1,
        marginRight: 5,
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
    },
    cancelButton: {
        flex: 1,
        marginLeft: 5,
        padding: 10,
        backgroundColor: '#dc3545',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});
export default BartenderCompleteModal; 
