import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { formatCurrency } from '@/utils/format';
import { downloadPaymentQRCode } from '@/api/payment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

export interface Props {
    isVisible: boolean;
    orderId: number | null;
    onClose: () => void;
    paymentError: string | null;
    totalAmount: number;
}

const QRCodeModal: React.FC<Props> = ({ isVisible, orderId, onClose, paymentError, totalAmount }) => {
    const [loading, setLoading] = useState(false);
    const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Reset states when modal opens or closes
    useEffect(() => {
        if (isVisible) {
            console.log("QRCodeModal opened with orderId:", orderId);
            setQrCodeUri(null);
            setError(null);
            setLoading(false);
        }
    }, [isVisible]);

    // Fetch QR code when modal is visible
    useEffect(() => {
        // Only fetch when modal is visible, we have an orderId, and no QR code yet
        if (isVisible && orderId && !qrCodeUri && !loading) {
            const getQRCode = async () => {
                try {
                    console.log("Downloading QR code for order ID:", orderId);
                    setLoading(true);
                    setError(null);
                    
                    // Download QR code
                    const uri = await downloadPaymentQRCode(orderId);
                    console.log("QR code downloaded to:", uri);
                    setQrCodeUri(uri);
                } catch (error: any) {
                    console.error("QR code download error:", error);
                    setError("Không thể tải mã QR thanh toán. Vui lòng thử lại sau.");
                    
                    // Try direct API call as fallback
                    try {
                        console.log("Trying direct API call for QR code");
                        const authToken = await AsyncStorage.getItem('authToken');
                        const apiUrl = Constants.expoConfig?.extra?.apiUrl;
                        
                        if (!apiUrl) {
                            throw new Error("API URL không được cấu hình");
                        }
                        
                        // Create a unique filename
                        const fileName = `qrcode-fallback-${orderId}-${Date.now()}.png`;
                        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
                        
                        // Download the file
                        const downloadResumable = FileSystem.createDownloadResumable(
                            `${apiUrl}/orders/${orderId}/qrcode`,
                            fileUri,
                            {
                                headers: {
                                    'Authorization': `Bearer ${authToken}`,
                                    'Accept': 'image/png, image/*',
                                },
                            }
                        );
                        
                        const result = await downloadResumable.downloadAsync();
                        if (result) {
                            console.log("QR code downloaded via fallback to:", result.uri);
                            setQrCodeUri(result.uri);
                            setError(null);
                        } else {
                            throw new Error("Tải mã QR không thành công");
                        }
                    } catch (fallbackError: any) {
                        console.error("Fallback QR code download error:", fallbackError);
                        setError("Không thể tải mã QR thanh toán. Vui lòng thử lại sau.");
                    }
                } finally {
                    setLoading(false);
                }
            };
            
            getQRCode();
        }
    }, [isVisible, orderId, qrCodeUri, loading]);

    // Clean up when modal closes
    useEffect(() => {
        return () => {
            if (qrCodeUri) {
                // Delete the file when component unmounts
                FileSystem.deleteAsync(qrCodeUri, { idempotent: true })
                    .catch(error => console.warn("Error deleting QR code file:", error));
            }
        };
    }, [qrCodeUri]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Mã QR thanh toán</Text>
                    <Text style={styles.modalText}>Tổng tiền: {formatCurrency(totalAmount)}</Text>
                    
                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}
                    {paymentError && !error && (
                        <Text style={styles.errorText}>{paymentError}</Text>
                    )}

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.loadingText}>Đang tải mã QR...</Text>
                        </View>
                    ) : qrCodeUri ? (
                        <View style={styles.qrCodeContainer}>
                            <Image 
                                source={{ uri: qrCodeUri }} 
                                style={styles.qrCode} 
                                resizeMode="contain"
                            />
                            <Text style={styles.instructionText}>
                                Quét mã QR này bằng ứng dụng ngân hàng để thanh toán
                            </Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            // Cleanup file when closing modal
                            if (qrCodeUri) {
                                FileSystem.deleteAsync(qrCodeUri, { idempotent: true })
                                    .catch(error => console.warn("Error deleting QR code file:", error));
                            }
                            onClose();
                        }}
                        disabled={loading}
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
        maxWidth: 500,
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
        marginTop: 20,
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
        marginTop: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    qrCodeContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    qrCode: {
        width: 250,
        height: 250,
        marginBottom: 15,
    },
    instructionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    }
});

export default QRCodeModal; 