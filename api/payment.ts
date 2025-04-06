import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

const paymentApi: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

paymentApi.interceptors.request.use(
  async (config) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken'); 
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error("Error getting auth token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Tạo URL đầy đủ với token
 * 
 * @param {string} path - Đường dẫn API
 * @param {string} token - Token xác thực
 * @returns {string} - URL đầy đủ với token
 */
const createAuthUrl = (path: string, token: string): string => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl || paymentApi.defaults.baseURL;
  return `${apiUrl}${path}?token=${encodeURIComponent(token)}`;
};

/**
 * Lấy URL hóa đơn PDF cho order với ID được cung cấp.
 *
 * @param {number} id - ID của order.
 * @returns {Promise<string>} - Promise resolve về URL của hóa đơn PDF.
 * @throws {Error} - Ném lỗi nếu có vấn đề trong quá trình xử lý.
 */
const getPaymentInvoiceUrl = async (id: number): Promise<string> => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      throw new Error("Không tìm thấy token xác thực");
    }

    // Kiểm tra liên kết
    const checkUrl = `${Constants.expoConfig?.extra?.apiUrl}/orders/${id}`;
    const response = await fetch(checkUrl, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Không thể truy cập đơn hàng. Status: ${response.status}`);
    }

    // Tạo URL với token
    const invoiceUrl = createAuthUrl(`/orders/${id}/invoice`, authToken);
    return invoiceUrl;
  } catch (error: unknown) {
    console.error("Lỗi khi tạo URL hóa đơn PDF:", error);
    throw new Error("Có lỗi không mong muốn xảy ra khi tạo URL hóa đơn PDF: " + (error instanceof Error ? error.message : String(error)));
  }
};

/**
 * Lấy URL mã QR thanh toán cho order với ID được cung cấp.
 *
 * @param {number} id - ID của order.
 * @returns {Promise<string>} - Promise resolve về URL của mã QR.
 * @throws {Error} - Ném lỗi nếu có vấn đề trong quá trình xử lý.
 */
const getPaymentQRCodeUrl = async (id: number): Promise<string> => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      throw new Error("Không tìm thấy token xác thực");
    }

    // Kiểm tra liên kết
    const checkUrl = `${Constants.expoConfig?.extra?.apiUrl}/orders/${id}`;
    const response = await fetch(checkUrl, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Không thể truy cập đơn hàng. Status: ${response.status}`);
    }

    // Tạo URL với token
    const qrCodeUrl = createAuthUrl(`/orders/${id}/qrcode`, authToken);
    return qrCodeUrl;
  } catch (error: unknown) {
    console.error("Lỗi khi tạo URL mã QR thanh toán:", error);
    throw new Error("Có lỗi không mong muốn xảy ra khi tạo URL mã QR thanh toán: " + (error instanceof Error ? error.message : String(error)));
  }
};

/**
 * Tải và lưu file PDF hóa đơn
 */
const downloadPaymentInvoicePDF = async (id: number): Promise<string> => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const apiUrl = Constants.expoConfig?.extra?.apiUrl || paymentApi.defaults.baseURL;
    console.log(`Downloading PDF from: ${apiUrl}/orders/${id}/invoice`);

    // Tạo tên file duy nhất cho hóa đơn
    const fileName = `invoice-${id}-${Date.now()}.pdf`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Tải file PDF
    const downloadResumable = FileSystem.createDownloadResumable(
      `${apiUrl}/orders/${id}/invoice`,
      fileUri,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': '*/*',
        },
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result) throw new Error('Download failed');
    
    console.log('File has been downloaded to:', result.uri);
    return result.uri;
  } catch (error) {
    console.error("Lỗi khi tải hóa đơn PDF:", error);
    throw error;
  }
};

/**
 * Tải và lưu file QR code
 */
const downloadPaymentQRCode = async (id: number): Promise<string> => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const apiUrl = Constants.expoConfig?.extra?.apiUrl || paymentApi.defaults.baseURL;
    const endpoint = `${apiUrl}/orders/${id}/qrcode`;
    console.log(`[DEBUG] Tải mã QR từ: ${endpoint} với token ${authToken.substring(0, 10)}...`);

    // Tạo tên file duy nhất cho QR code
    const fileName = `qrcode-${id}-${Date.now()}.png`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    console.log(`[DEBUG] Lưu file vào: ${fileUri}`);

    // Tải file QR code
    const downloadResumable = FileSystem.createDownloadResumable(
      endpoint,
      fileUri,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'image/png, image/*',
        },
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result) throw new Error('Download failed');
    
    console.log('File has been downloaded to:', result.uri);
    return result.uri;
  } catch (error) {
    console.error("Lỗi khi tải mã QR:", error);
    throw error;
  }
};

/**
 * Xóa file cũ
 */
const cleanupOldFiles = async (pattern: string) => {
  try {
    const directory = FileSystem.documentDirectory;
    if (!directory) throw new Error('Document directory not available');
    
    const files = await FileSystem.readDirectoryAsync(directory);
    const oldFiles = files.filter(file => file.startsWith(pattern));
    
    for (const file of oldFiles) {
      const fileUri = `${directory}${file}`;
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }
    console.log(`Cleaned up old ${pattern} files`);
  } catch (error) {
    console.warn(`Error cleaning up old ${pattern} files:`, error);
  }
};

export { downloadPaymentInvoicePDF, downloadPaymentQRCode, cleanupOldFiles }; 