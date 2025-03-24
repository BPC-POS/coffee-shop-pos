import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { formatCurrency } from '@/utils/format';
import {getPaymentQRCodeImage} from '@/api/payment'; // Import getPaymentQRCodeImage

export interface Props {
    isVisible: boolean;
    totalAmount: number;
    onPaymentMethodSelect: (method: 'cash' | 'transfer') => Promise<void>; // Giữ nguyên kiểu Promise<void>
    qrCodeImageBlob: Blob | null; // Có thể không cần prop này nữa, hoặc dùng để hiển thị QR đã fetch sẵn (tùy logic)
    onClose: () => void;
    paymentError: string | null;
    orderId: number | null; // Nhận orderId từ PosOrderSummary
}

const PaymentModal: React.FC<Props> = ({ isVisible, totalAmount, onPaymentMethodSelect, onClose, qrCodeImageBlob, paymentError, orderId }) => {
    const [paymentLoading, setPaymentLoading] = React.useState(false);
    const [localQrCodeImageBlob, setLocalQrCodeImageBlob] = React.useState<Blob | null>(null); // State nội bộ cho QR code
    const [localPaymentError, setLocalPaymentError] = React.useState<string | null>(null); // State nội bộ cho lỗi thanh toán

    React.useEffect(() => {
        if (isVisible && orderId && !localQrCodeImageBlob && !localPaymentError) {
            // Fetch QR code khi modal mở và có orderId và chưa fetch QR thành công
            const fetchQrCode = async () => {
                setPaymentLoading(true);
                setLocalPaymentError(null); // Reset lỗi trước khi fetch mới
                try {
                    const qrCodeData = await getPaymentQRCodeImage(orderId);
                    if (qrCodeData) {
                        setLocalQrCodeImageBlob(qrCodeData);
                    } else {
                        setLocalPaymentError("Không thể tải mã QR. Dữ liệu QR không hợp lệ.");
                    }
                } catch (error: any) {
                    setLocalPaymentError("Lỗi khi lấy mã QR thanh toán. Vui lòng thử lại.");
                    console.error("Lỗi fetch QR code trong PaymentModal:", error);
                } finally {
                    setPaymentLoading(false);
                }
            };
            fetchQrCode();
        }
    }, [isVisible, orderId, localQrCodeImageBlob, localPaymentError]);

    const handleMethodSelect = async (method: 'cash' | 'transfer') => {
        setPaymentLoading(true);
        setLocalPaymentError(null); // Reset lỗi khi chọn phương thức thanh toán mới
        if (method === 'transfer' && !orderId) {
            setLocalPaymentError("Lỗi: Không có Order ID để tạo mã QR.");
            setPaymentLoading(false);
            return;
        }
        await onPaymentMethodSelect(method); // Gọi callback từ component cha để xử lý thanh toán cuối cùng
        setPaymentLoading(false); // Loading button sẽ dừng khi callback cha xử lý xong (hoặc modal đóng)
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

                    {localPaymentError && ( // Hiển thị lỗi nội bộ của Modal
                        <Text style={styles.errorText}>{localPaymentError}</Text>
                    )}
                    {paymentError && !localPaymentError && ( // Hiển thị lỗi từ prop, ưu tiên lỗi nội bộ nếu có
                        <Text style={styles.errorText}>{paymentError}</Text>
                    )}

                    {localQrCodeImageBlob && ( // Sử dụng localQrCodeImageBlob để hiển thị QR
                        <View style={styles.qrCodeContainer}>
                             <Text style={styles.qrCodeDescription}>Quét mã QR để thanh toán</Text>
                            <>
                                {paymentLoading && <ActivityIndicator />}
                                <Image
                                    source={{ uri: `data:image/png;base64,${localQrCodeImageBlob}` }}
                                    style={styles.qrCodeImage}
                                    resizeMode="contain"
                                />
                            </>
                        </View>
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
    qrCodeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    qrCodeDescription: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    qrCodeImage: {
        width: 200,
        height: 200,
    },
    errorText: {
        color: '#dc3545',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default PaymentModal;