import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { formatCurrency } from '@/utils/format';
import { getPaymentInvoicePDF } from '@/api/payment';
import * as Print from 'expo-print';

export interface Props {
    isVisible: boolean;
    orderId: number | null;
    onClose: () => void;
    paymentError: string | null;
    totalAmount: number;
}

const InvoicePDFModal: React.FC<Props> = ({ isVisible, orderId, onClose, paymentError, totalAmount }) => {
    const [paymentLoading, setPaymentLoading] = React.useState(false);
    const [pdfDataUri, setPdfDataUri] = React.useState<string | null>(null);
    const [localPaymentError, setLocalPaymentError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isVisible && orderId && !pdfDataUri && !localPaymentError) {
            const fetchPaymentInvoice = async () => {
                setPaymentLoading(true);
                setLocalPaymentError(null);
                try {
                    const pdfData = await getPaymentInvoicePDF(orderId);
                    if (pdfData) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64data = reader.result as string;
                            setPdfDataUri(base64data);
                        };
                        reader.onerror = () => {
                            setLocalPaymentError("Lỗi khi đọc dữ liệu PDF.");
                        };
                        reader.readAsDataURL(pdfData);
                    } else {
                        setLocalPaymentError("Không thể tải hóa đơn PDF. Dữ liệu PDF không hợp lệ.");
                    }
                } catch (error: any) {
                    setLocalPaymentError("Lỗi khi lấy hóa đơn thanh toán. Vui lòng thử lại.");
                    console.error("Lỗi fetch PDF invoice trong InvoicePDFModal:", error);
                } finally {
                    setPaymentLoading(false);
                }
            };
            fetchPaymentInvoice();
        }
    }, [isVisible, orderId, pdfDataUri, localPaymentError]);

    const showPdfPreview = async () => {
        if (pdfDataUri) {
            setPaymentLoading(true);
            try {
                await Print.printAsync({
                    html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><embed width="100%" height="100%" src="${pdfDataUri}" type="application/pdf" /></body></html>`
                });
            } catch (error: any) {
                setLocalPaymentError("Lỗi khi hiển thị hóa đơn PDF.");
                console.error("Lỗi Print.printAsync:", error);
            } finally {
                setPaymentLoading(false);
                onClose(); 
            }
        } else {
            setLocalPaymentError("Không có dữ liệu PDF để hiển thị.");
        }
    };


    React.useEffect(() => {
        if (pdfDataUri && isVisible) {
            showPdfPreview(); // Gọi showPdfPreview khi có pdfDataUri và modal isVisible
        }
    }, [pdfDataUri, isVisible]);


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Hóa đơn thanh toán</Text>
                    {totalAmount && <Text style={styles.modalText}>Tổng tiền: {formatCurrency(totalAmount)}</Text>}

                    {localPaymentError && (
                        <Text style={styles.errorText}>{localPaymentError}</Text>
                    )}
                    {paymentError && !localPaymentError && (
                        <Text style={styles.errorText}>{paymentError}</Text>
                    )}

                    {paymentLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
                        </View>
                    )}

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
        maxWidth: 600,
        maxHeight: '90%',
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
    loadingContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    }
});

export default InvoicePDFModal;