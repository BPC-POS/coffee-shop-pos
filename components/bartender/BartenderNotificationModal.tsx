import { OrderItem } from '@/types/Order';
import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

interface NotificationModalProps {
    isVisible: boolean;
    onClose: () => void;
    notifications: any[];
}

const BartenderNotificationModal: React.FC<NotificationModalProps> = ({ isVisible, onClose, notifications }) => {
    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Đơn hàng mới</Text>

                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.notificationItem}>
                                <Text style={styles.orderText}>
                                    <Text style={styles.boldText}>Mã đơn:</Text> {item.orderNumber}
                                </Text>
                                <Text style={styles.orderText}>
                                    <Text style={styles.boldText}>Bàn:</Text> {item.tableId}
                                </Text>
                                <Text style={styles.orderText}>
                                    <Text style={styles.boldText}>Món:</Text> {item.items.map((i: OrderItem) => `${i.productName} x${i.quantity}`).join(', ')}
                                </Text>
                                <Text style={styles.orderText}>
                                    <Text style={styles.boldText}>Tổng tiền:</Text> {item.totalAmount.toLocaleString()} VND
                                </Text>
                            </View>
                        )}
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: 320, backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#8b4513' },
    notificationItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', width: '100%' },
    orderText: { fontSize: 16, marginBottom: 5 },
    boldText: { fontWeight: 'bold' },
    closeButton: { marginTop: 15, padding: 10, backgroundColor: '#8b4513', borderRadius: 5, width: '100%', alignItems: 'center' },
    closeText: { color: '#fff', fontWeight: 'bold' },
});

export default BartenderNotificationModal;
