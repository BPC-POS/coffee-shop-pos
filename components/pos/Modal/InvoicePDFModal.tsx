import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { formatCurrency } from '@/utils/format';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export interface Props {
    isVisible: boolean;
    orderId: number | null;
    onClose: () => void;
    paymentError: string | null;
    totalAmount: number;
}

const InvoicePDFModal: React.FC<Props> = ({ isVisible, orderId, onClose, paymentError, totalAmount }) => {
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Reset states when modal opens
    useEffect(() => {
        if (isVisible) {
            console.log("InvoicePDFModal opened with orderId:", orderId);
            setPdfUrl(null);
            setError(null);
        }
    }, [isVisible]);

    // Prepare PDF URL when modal is visible
    useEffect(() => {
        if (isVisible && orderId) {
            const preparePdfUrl = async () => {
                try {
                    console.log("Preparing PDF URL for order ID:", orderId);
                    setLoading(true);
                    setError(null);
                    
                    const authToken = await AsyncStorage.getItem('authToken');
                    if (!authToken) {
                        throw new Error("Không tìm thấy token xác thực");
                    }

                    const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://bpc-pos-admin-panel-api.nibies.space';
                    const directPdfUrl = `${apiUrl}/orders/${orderId}/invoice?token=${encodeURIComponent(authToken)}`;
                    
                    console.log("Direct PDF URL prepared");
                    setPdfUrl(directPdfUrl);
                    
                } catch (error: any) {
                    console.error("PDF URL preparation error:", error);
                    setError(error.message || "Không thể tải hóa đơn. Vui lòng thử lại sau.");
                } finally {
                    setLoading(false);
                }
            };
            
            preparePdfUrl();
        }
    }, [isVisible, orderId]);

    const getWebViewContent = () => {
        if (!pdfUrl) return null;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body, html {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        background: #f5f5f5;
                        font-family: system-ui, -apple-system, sans-serif;
                    }
                    .container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }
                    .pdf-viewer {
                        flex: 1;
                        width: 100%;
                        height: 100%;
                        border: none;
                        background: white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .loading {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(255,255,255,0.9);
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .error {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: #fff3f3;
                        color: #d32f2f;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        max-width: 80%;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <iframe
                        class="pdf-viewer"
                        src="${pdfUrl}"
                        type="application/pdf"
                        onload="handleFrameLoad()"
                        onerror="handleFrameError()"
                    ></iframe>
                </div>
                <script>
                    function handleFrameLoad() {
                        window.ReactNativeWebView.postMessage('PDF_LOADED');
                    }
                    
                    function handleFrameError() {
                        window.ReactNativeWebView.postMessage('PDF_ERROR');
                    }
                </script>
            </body>
            </html>
        `;
    };

    const handleWebViewMessage = (event: any) => {
        const message = event.nativeEvent.data;
        console.log("WebView message:", message);
        
        if (message === 'PDF_ERROR') {
            setError("Không thể hiển thị hóa đơn. Vui lòng thử lại sau.");
        }
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
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Hóa đơn thanh toán</Text>
                        <Text style={styles.modalText}>Tổng tiền: {formatCurrency(totalAmount)}</Text>
                    </View>

                    {(error || paymentError) && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="warning" size={24} color="#dc3545" />
                            <Text style={styles.errorText}>{error || paymentError}</Text>
                        </View>
                    )}

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
                        </View>
                    ) : (
                        <View style={styles.pdfContainer}>
                            {pdfUrl && (
                                <WebView
                                    source={{ html: getWebViewContent() || '' }}
                                    style={styles.webView}
                                    onMessage={handleWebViewMessage}
                                    onError={() => setError("Không thể hiển thị hóa đơn")}
                                    originWhitelist={['*']}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    startInLoadingState={true}
                                    renderLoading={() => (
                                        <View style={styles.loadingOverlay}>
                                            <ActivityIndicator size="large" color="#007bff" />
                                            <Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
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
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 0,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '95%',
        maxWidth: 800,
        height: '90%',
        overflow: 'hidden',
    },
    modalHeader: {
        width: '100%',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    modalText: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff3f3',
        padding: 12,
        marginTop: 12,
        marginHorizontal: 16,
        borderRadius: 8,
        width: '90%',
    },
    errorText: {
        color: '#dc3545',
        marginLeft: 8,
        flex: 1,
        fontSize: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    pdfContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f8f9fa',
    },
    webView: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        marginVertical: 16,
        width: '90%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default InvoicePDFModal;